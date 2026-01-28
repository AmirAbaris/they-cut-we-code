export interface TestCaseResult {
  status: string;
  stdout: string;
  stderr: string;
  timeMs: number;
  expected?: string;
  got?: string;
}

export interface RunResult {
  verdict: string;
  cases: TestCaseResult[];
}

export interface RunCodeDto {
  problemId: number;
  language: "js" | "py";
  code: string;
}
