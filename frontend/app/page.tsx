"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  tags: string[];
}

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getProblems() {
      try {
        const res = await fetch(`${API_URL}/problems`, { cache: "no-store" });
        if (!res.ok) {
          return [];
        }
        const data = await res.json();
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setLoading(false);
      }
    }
    getProblems();
  }, []);

  const difficultyColors: Record<string, string> = {
    Easy: "text-green-600 bg-green-100",
    Medium: "text-yellow-600 bg-yellow-100",
    Hard: "text-red-600 bg-red-100",
  };

  const filteredProblems = problems.filter((problem) => {
    const query = searchQuery.toLowerCase();
    return (
      problem.title.toLowerCase().includes(query) ||
      problem.difficulty.toLowerCase().includes(query) ||
      problem.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

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
          <input
            type="text"
            placeholder="Search by title, difficulty, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading problems...</p>
          </div>
        ) : problems.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              No problems found. Make sure the backend is running on {API_URL}
            </p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600">
              No problems match your search query.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProblems.map((problem) => (
              <Link
                key={problem.id}
                href={`/problems/${problem.id}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {problem.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      difficultyColors[problem.difficulty] ||
                      "text-gray-600 bg-gray-100"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
