export class TestCaseDto {
  input: string;
  output: string;
}

export class ProblemDetailDto {
  id: number;
  slug: string;
  title: string;
  difficulty: string;
  tags: string[];
  statementMd: string;
  starterCode: {
    js: string;
    py: string;
  };
  samples: TestCaseDto[];
}
