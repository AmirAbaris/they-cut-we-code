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
      <button
        onClick={onRun}
        disabled={isRunning}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRunning ? "Running..." : "Run"}
      </button>
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
