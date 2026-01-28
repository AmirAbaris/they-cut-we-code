import { Problem } from "../types/problem.types";

export function filterProblems(problems: Problem[], query: string): Problem[] {
  if (!query.trim()) {
    return problems;
  }

  const lowerQuery = query.toLowerCase();
  return problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(lowerQuery) ||
      problem.difficulty.toLowerCase().includes(lowerQuery) ||
      problem.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
}
