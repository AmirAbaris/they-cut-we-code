"use client";

import { useEffect, useState } from "react";
import { useProblems } from "@/features/problems/hooks/use-problems";
import { ProblemList } from "@/features/problems/components/problem-list";
import { ProblemSearch } from "@/features/problems/components/problem-search";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { AboutDialog } from "@/shared/components/about-dialog";
import { BrandDialog } from "@/shared/components/brand-dialog";
import { API_URL } from "@/shared/constants/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const { data, isLoading, error } = useProblems({
    page,
    limit,
    q: searchQuery.trim() ? searchQuery : undefined,
  });
  const problems = data?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">They Cut, We Code</h1>
            <p className="text-muted-foreground">
              Offline-first coding platform. Practice coding problems without
              internet.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BrandDialog />
            <AboutDialog />

            <ThemeToggle />
          </div>
        </div>

        <div className="mb-6">
          <ProblemSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState
            message={`Failed to load problems. Make sure the backend is running on ${API_URL}`}
          />
        ) : problems.length === 0 ? (
          <ErrorState
            message={
              searchQuery.trim()
                ? "No problems match your search."
                : `No problems found. Make sure the backend is running on ${API_URL}`
            }
            variant="warning"
          />
        ) : (
          <div className="space-y-6">
            <ProblemList problems={problems} />

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {data.page} of {data.totalPages} • {data.total} total
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!data.hasPrevious}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
