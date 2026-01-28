interface ProblemSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProblemSearch({ value, onChange }: ProblemSearchProps) {
  return (
    <input
      type="text"
      placeholder="Search by title, difficulty, or tags..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
    />
  );
}
