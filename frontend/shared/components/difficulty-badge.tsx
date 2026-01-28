import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: string;
}

const difficultyVariants: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-500/20 dark:text-green-400",
  Medium: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400",
  Hard: "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        difficultyVariants[difficulty] ||
          "bg-muted text-muted-foreground border-border"
      )}
    >
      {difficulty}
    </Badge>
  );
}
