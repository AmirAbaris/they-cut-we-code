export interface Problem {
  id: number;
  slug: string;
  title: string;
  difficulty: string;
  tags: string[];
}

export interface ProblemDetail extends Problem {
  statementMd: string;
  starterCode: {
    js: string;
    py: string;
  };
  samples: Array<{
    input: string;
    output: string;
  }>;
}
