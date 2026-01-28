interface ErrorStateProps {
  message: string;
  variant?: "error" | "warning";
}

export function ErrorState({ message, variant = "error" }: ErrorStateProps) {
  const styles =
    variant === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-yellow-50 border-yellow-200 text-yellow-800";

  return (
    <div className={`border rounded-lg p-4 ${styles}`}>
      <p>{message}</p>
    </div>
  );
}
