export class TestCaseResultDto {
  status: string;
  stdout: string;
  stderr: string;
  timeMs: number;
  expected?: string;
  got?: string;
}

export class RunResultDto {
  verdict: string;
  cases: TestCaseResultDto[];
}
