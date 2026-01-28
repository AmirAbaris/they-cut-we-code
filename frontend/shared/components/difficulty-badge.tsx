interface DifficultyBadgeProps {
  difficulty: string;
}

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-100",
  Medium: "text-yellow-600 bg-yellow-100",
  Hard: "text-red-600 bg-red-100",
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded ${
        difficultyColors[difficulty] || "text-gray-600 bg-gray-100"
      }`}
    >
      {difficulty}
    </span>
  );
}
