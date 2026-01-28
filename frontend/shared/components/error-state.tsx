import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message: string;
  variant?: "error" | "warning";
}

export function ErrorState({ message, variant = "error" }: ErrorStateProps) {
  return (
    <Card
      className={cn(
        variant === "error"
          ? "border-destructive bg-destructive/10"
          : "border-yellow-500/50 bg-yellow-500/10"
      )}
    >
      <CardContent className="p-4">
        <p
          className={cn(
            variant === "error"
              ? "text-destructive"
              : "text-yellow-700 dark:text-yellow-400"
          )}
        >
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
