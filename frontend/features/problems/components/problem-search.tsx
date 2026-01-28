import { Input } from "@/components/ui/input";

interface ProblemSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProblemSearch({ value, onChange }: ProblemSearchProps) {
  return (
    <Input
      type="text"
      placeholder="Search by title, difficulty, or tags..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  );
}
