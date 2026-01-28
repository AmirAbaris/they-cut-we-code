export enum Verdict {
  ACCEPTED = 'AC',
  WRONG_ANSWER = 'WA',
  TIME_LIMIT_EXCEEDED = 'TLE',
  RUNTIME_ERROR = 'RE',
  MEMORY_LIMIT_EXCEEDED = 'MLE',
}

export enum Language {
  JAVASCRIPT = 'js',
  PYTHON = 'py',
}

export interface ExecutionResult {
  verdict: Verdict;
  stdout: string;
  stderr: string;
  exitCode: number;
  timeMs: number;
  memoryKb?: number;
}

export interface RunTestCaseResult extends ExecutionResult {
  expected?: string;
  got?: string;
}
