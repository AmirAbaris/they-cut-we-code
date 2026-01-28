import { Problem } from "../types/problem.types";
import { ProblemCard } from "./problem-card";

interface ProblemListProps {
  problems: Problem[];
}

export function ProblemList({ problems }: ProblemListProps) {
  if (problems.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No problems match your search query.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}
