import { Button } from "@/components/ui/button";

interface EditorActionsProps {
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

export function EditorActions({
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
}: EditorActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onRun}
        disabled={isRunning}
        variant="default"
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {isRunning ? "Running..." : "Run"}
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        variant="default"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}
