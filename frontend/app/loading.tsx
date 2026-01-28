import { Skeleton } from "@/components/ui/skeleton";
import { ProblemCardSkeleton } from "@/shared/components/problem-card-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProblemCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
