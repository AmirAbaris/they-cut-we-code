import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Language, Verdict, ExecutionResult } from './runner.types';

@Injectable()
export class RunnerService {
  private readonly logger = new Logger(RunnerService.name);
  private readonly tmpDir = path.join(process.cwd(), 'tmp');
  private readonly maxOutputSize = 64 * 1024; // 64KB
  private readonly timeoutMs = 5000; // 5 seconds hard timeout
  private readonly memoryLimit = '256m';
  private readonly cpuLimit = '1.0';
  private readonly dockerPath: string;

  constructor() {
    // Ensure tmp directory exists
    fs.mkdir(this.tmpDir, { recursive: true }).catch((err) => {
      this.logger.error(`Failed to create tmp directory: ${err.message}`);
    });

    // Find Docker executable
    this.dockerPath = this.findDockerPath();
    if (!this.dockerPath) {
      this.logger.warn(
        'Docker not found in PATH. Make sure Docker is installed and accessible. ' +
        'Common paths: /usr/local/bin/docker, /usr/bin/docker, /Applications/Docker.app/Contents/Resources/bin/docker'
      );
    }
  }

  private findDockerPath(): string {
    // Check environment variable first
    if (process.env.DOCKER_PATH) {
      return process.env.DOCKER_PATH;
    }

    // Common Docker paths
    const commonPaths = [
      '/usr/local/bin/docker',
      '/usr/bin/docker',
      '/Applications/Docker.app/Contents/Resources/bin/docker', // macOS Docker Desktop
      '/opt/homebrew/bin/docker', // macOS Homebrew on Apple Silicon
    ];

    for (const dockerPath of commonPaths) {
      try {
        // Check if file exists (synchronous check)
        const fsSync = require('fs');
        if (fsSync.existsSync(dockerPath)) {
          return dockerPath;
        }
      } catch {
        // Continue checking other paths
      }
    }

    // Fallback to 'docker' and hope it's in PATH
    return 'docker';
  }

  async executeCode(code: string, language: Language, input: string): Promise<ExecutionResult> {
    const runId = uuidv4();
    const workDir = path.join(this.tmpDir, `run-${runId}`);

    try {
      // Create work directory
      await fs.mkdir(workDir, { recursive: true });

      // Write code to file
      const filename = language === Language.JAVASCRIPT ? 'main.js' : 'main.py';
      const codePath = path.join(workDir, filename);
      await fs.writeFile(codePath, code, 'utf-8');

      // Write input to a file (will be accessible via /work/input.txt in container)
      // Convert literal \n to actual newlines
      let processedInput = input || '';
      processedInput = processedInput.replace(/\\n/g, '\n');
      const inputPath = path.join(workDir, 'input.txt');
      await fs.writeFile(inputPath, processedInput, 'utf-8');
      
      this.logger.debug(`Input file written: ${inputPath}, content length: ${processedInput.length}, preview: ${processedInput.substring(0, 100)}`);

      // Execute in Docker (no stdin needed, input is in file)
      const result = await this.runDockerContainer(runId, language, workDir, '');

      return result;
    } catch (error) {
      this.logger.error(`Execution error: ${error.message}`);
      return {
        verdict: Verdict.RUNTIME_ERROR,
        stdout: '',
        stderr: error.message,
        exitCode: -1,
        timeMs: 0,
      };
    } finally {
      // Cleanup
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch (err) {
        this.logger.warn(`Failed to cleanup ${workDir}: ${err.message}`);
      }
    }
  }

  private async runDockerContainer(
    runId: string,
    language: Language,
    workDir: string,
    input: string
  ): Promise<ExecutionResult> {
    const containerName = `judge-${runId}`;
    const image =
      language === Language.JAVASCRIPT ? 'node:20-bookworm-slim' : 'python:3.12-slim';
    const command = language === Language.JAVASCRIPT ? 'node' : 'python';
    const filePath = language === Language.JAVASCRIPT ? '/work/main.js' : '/work/main.py';

    // Resolve to absolute path for Docker
    const absoluteWorkDir = path.resolve(workDir);

    const dockerArgs = [
      'run',
      '--rm',
      '--name',
      containerName,
      '--network',
      'none',
      '--cpus',
      this.cpuLimit,
      '--memory',
      this.memoryLimit,
      '--memory-swap',
      this.memoryLimit,
      '--pids-limit',
      '128',
      '--security-opt',
      'no-new-privileges',
      '--cap-drop',
      'ALL',
      '--read-only',
      '--tmpfs',
      '/tmp:rw,nosuid,nodev,noexec,size=64m',
      '-v',
      `${absoluteWorkDir}:/work:ro`,
      '-w',
      '/work',
      '--user',
      '1000:1000',
      image,
      command,
      filePath,
    ];

    return new Promise<ExecutionResult>((resolve) => {
      const startTime = Date.now();
      let stdout = '';
      let stderr = '';
      let exitCode = 0;
      let timedOut = false;

      const dockerProcess = spawn(this.dockerPath, dockerArgs, {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // Set hard timeout
      const timeout = setTimeout(() => {
        timedOut = true;
        dockerProcess.kill('SIGKILL');
        // Also kill container explicitly
        spawn(this.dockerPath, ['kill', containerName], { stdio: 'ignore' });
      }, this.timeoutMs);

      // Input is now in /tmp/input.txt file, no need to write to stdin
      dockerProcess.stdin.end();

      // Capture stdout with size limit
      dockerProcess.stdout.on('data', (data: Buffer) => {
        const chunk = data.toString();
        if (stdout.length + chunk.length <= this.maxOutputSize) {
          stdout += chunk;
        } else if (stdout.length < this.maxOutputSize) {
          stdout += chunk.substring(0, this.maxOutputSize - stdout.length);
          stdout += '\n[Output truncated due to size limit]';
        }
      });

      // Capture stderr with size limit
      dockerProcess.stderr.on('data', (data: Buffer) => {
        const chunk = data.toString();
        if (stderr.length + chunk.length <= this.maxOutputSize) {
          stderr += chunk;
        } else if (stderr.length < this.maxOutputSize) {
          stderr += chunk.substring(0, this.maxOutputSize - stderr.length);
          stderr += '\n[Output truncated due to size limit]';
        }
      });

      dockerProcess.on('close', (code) => {
        clearTimeout(timeout);
        const timeMs = Date.now() - startTime;
        exitCode = code || 0;

        let verdict: Verdict;
        if (timedOut) {
          verdict = Verdict.TIME_LIMIT_EXCEEDED;
        } else if (exitCode !== 0) {
          verdict = Verdict.RUNTIME_ERROR;
        } else {
          // Verdict will be determined by comparing output
          verdict = Verdict.ACCEPTED;
        }

        resolve({
          verdict,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode,
          timeMs,
        });
      });

      dockerProcess.on('error', (error) => {
        clearTimeout(timeout);
        let errorMessage = `Docker execution error: ${error.message}`;
        
        if (error.message.includes('ENOENT')) {
          errorMessage = `Docker not found. Please install Docker or set DOCKER_PATH environment variable.\n` +
            `Current docker path: ${this.dockerPath}\n` +
            `Error: ${error.message}`;
        }
        
        resolve({
          verdict: Verdict.RUNTIME_ERROR,
          stdout: '',
          stderr: errorMessage,
          exitCode: -1,
          timeMs: Date.now() - startTime,
        });
      });
    });
  }

  normalizeOutput(output: string): string {
    return output
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trimEnd();
  }

  compareOutput(actual: string, expected: string): boolean {
    const normalizedActual = this.normalizeOutput(actual);
    const normalizedExpected = this.normalizeOutput(expected);
    return normalizedActual === normalizedExpected;
  }
}
