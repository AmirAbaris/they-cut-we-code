export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
