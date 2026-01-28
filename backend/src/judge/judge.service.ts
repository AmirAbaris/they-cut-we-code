import { Injectable } from '@nestjs/common';
import { ProblemsService } from '../problems/problems.service';
import { RunnerService } from '../runner/runner.service';
import { SubmissionsService } from '../submissions/submissions.service';
import { Verdict, Language, RunTestCaseResult } from '../runner/runner.types';

@Injectable()
export class JudgeService {
  constructor(
    private readonly problemsService: ProblemsService,
    private readonly runnerService: RunnerService,
    private readonly submissionsService: SubmissionsService
  ) {}

  async runCode(
    problemId: number,
    language: string,
    code: string
  ): Promise<{
    verdict: string;
    cases: Array<{
      status: string;
      stdout: string;
      stderr: string;
      timeMs: number;
      expected?: string;
      got?: string;
    }>;
  }> {
    const testCases = this.problemsService.getTestCases(problemId, false); // samples only

    const lang = language === 'js' ? Language.JAVASCRIPT : Language.PYTHON;
    const results: Array<{
      status: string;
      stdout: string;
      stderr: string;
      timeMs: number;
      expected?: string;
      got?: string;
    }> = [];

    for (const testCase of testCases) {
      const execResult = await this.runnerService.executeCode(code, lang, testCase.input_text);

      let verdict = execResult.verdict;
      if (verdict === Verdict.ACCEPTED) {
        const matches = this.runnerService.compareOutput(
          execResult.stdout,
          testCase.expected_output_text
        );
        if (!matches) {
          verdict = Verdict.WRONG_ANSWER;
        }
      }

      results.push({
        status: verdict,
        stdout: execResult.stdout,
        stderr: execResult.stderr,
        timeMs: execResult.timeMs,
        expected: testCase.expected_output_text,
        got: execResult.stdout,
      });
    }

    // Determine overall verdict
    const overallVerdict = this.determineOverallVerdict(results.map(r => ({ verdict: r.status as Verdict })));

    return {
      verdict: overallVerdict,
      cases: results,
    };
  }

  async submitCode(
    problemId: number,
    language: string,
    code: string
  ): Promise<{
    verdict: string;
    cases: Array<{
      status: string;
      stdout: string;
      stderr: string;
      timeMs: number;
    }>;
  }> {
    const testCases = this.problemsService.getTestCases(problemId, true); // all cases

    const lang = language === 'js' ? Language.JAVASCRIPT : Language.PYTHON;
    const results: Array<{
      status: string;
      stdout: string;
      stderr: string;
      timeMs: number;
      caseId: number;
    }> = [];

    let overallVerdict = Verdict.ACCEPTED;

    for (const testCase of testCases) {
      const execResult = await this.runnerService.executeCode(code, lang, testCase.input_text);

      let verdict = execResult.verdict;
      if (verdict === Verdict.ACCEPTED) {
        const matches = this.runnerService.compareOutput(
          execResult.stdout,
          testCase.expected_output_text
        );
        if (!matches) {
          verdict = Verdict.WRONG_ANSWER;
          if (overallVerdict === Verdict.ACCEPTED) {
            overallVerdict = Verdict.WRONG_ANSWER;
          }
        }
      } else {
        // TLE, RE, MLE take precedence
        if (overallVerdict === Verdict.ACCEPTED || overallVerdict === Verdict.WRONG_ANSWER) {
          overallVerdict = verdict;
        }
      }

      results.push({
        status: verdict,
        stdout: execResult.stdout,
        stderr: execResult.stderr,
        timeMs: execResult.timeMs,
        caseId: testCase.id,
      });

      // Early exit on first failure (optional optimization)
      if (verdict !== Verdict.ACCEPTED && testCase.is_hidden === 1) {
        break;
      }
    }

    // Persist submission
    const submissionId = this.submissionsService.createSubmission({
      problemId,
      language,
      code,
      verdict: overallVerdict,
    });

    // Persist case results
    for (const result of results) {
      this.submissionsService.createSubmissionCase({
        submissionId,
        caseId: result.caseId,
        status: result.status,
        timeMs: result.timeMs,
        stdout: result.stdout,
        stderr: result.stderr,
      });
    }

    return {
      verdict: overallVerdict,
      cases: results.map((r) => ({
        status: r.status,
        stdout: r.stdout,
        stderr: r.stderr,
        timeMs: r.timeMs,
      })),
    };
  }

  private determineOverallVerdict(results: Array<{ verdict: Verdict }>): Verdict {
    for (const result of results) {
      if (result.verdict !== Verdict.ACCEPTED) {
        return result.verdict;
      }
    }
    return Verdict.ACCEPTED;
  }
}
