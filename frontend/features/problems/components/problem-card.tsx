import Link from "next/link";
import { Problem } from "../types/problem.types";
import { DifficultyBadge } from "@/shared/components/difficulty-badge";
import { TagList } from "@/shared/components/tag-list";

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <Link
      href={`/problems/${problem.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {problem.title}
          </h2>
          <TagList tags={problem.tags} />
        </div>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
    </Link>
  );
}
