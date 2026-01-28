"use client";

import { useState, useMemo } from "react";
import { useProblems } from "@/features/problems/hooks/use-problems";
import { ProblemList } from "@/features/problems/components/problem-list";
import { ProblemSearch } from "@/features/problems/components/problem-search";
import { filterProblems } from "@/features/problems/utils/filter-problems";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { API_URL } from "@/shared/constants/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: problems = [], isLoading, error } = useProblems();

  const filteredProblems = useMemo(
    () => filterProblems(problems, searchQuery),
    [problems, searchQuery],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            They Cut, We Code
          </h1>
          <p className="text-gray-600">
            Offline-first coding platform. Practice coding problems without
            internet.
          </p>
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
            message={`No problems found. Make sure the backend is running on ${API_URL}`}
            variant="warning"
          />
        ) : (
          <ProblemList problems={filteredProblems} />
        )}
      </div>
    </div>
  );
}
