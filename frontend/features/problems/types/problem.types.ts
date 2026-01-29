export interface Problem {
  id: number;
  slug: string;
  title: string;
  difficulty: string;
  tags: string[];
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
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
