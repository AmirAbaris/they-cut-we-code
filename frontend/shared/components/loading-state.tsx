import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
