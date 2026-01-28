import Link from "next/link";
import { Problem } from "../types/problem.types";
import { DifficultyBadge } from "@/shared/components/difficulty-badge";
import { TagList } from "@/shared/components/tag-list";
import { Card, CardContent } from "@/components/ui/card";

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <Link href={`/problems/${problem.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
              <TagList tags={problem.tags} />
            </div>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
