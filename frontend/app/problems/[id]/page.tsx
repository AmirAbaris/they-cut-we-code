"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProblem } from "@/features/problems/hooks/use-problem";
import { useRunCode } from "@/features/judge/hooks/use-run-code";
import { useSubmitCode } from "@/features/judge/hooks/use-submit-code";
import { ProblemStatement } from "@/features/problems/components/problem-statement";
import { CodeEditor } from "@/features/judge/components/code-editor";
import { RunResults } from "@/features/judge/components/run-results";
import { SubmitResults } from "@/features/judge/components/submit-results";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { getErrorMessage } from "@/shared/utils/api-error";

export default function ProblemPage() {
  const params = useParams();
  const problemId = params.id as string;

  const { data: problem, isLoading, error } = useProblem(problemId);
  const runCodeMutation = useRunCode();
  const submitCodeMutation = useSubmitCode();

  const [language, setLanguage] = useState<"js" | "py">("js");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language]);
    }
  }, [problem, language]);

  const handleRun = () => {
    if (!problem) return;
    runCodeMutation.mutate(
      {
        problemId: problem.id,
        language,
        code,
      },
      {
        onSuccess: (result) => {
          if (!result.success) {
            console.error("Error running code:", result.error.message);
          }
        },
      },
    );
  };

  const handleSubmit = () => {
    if (!problem) return;
    submitCodeMutation.mutate(
      {
        problemId: problem.id,
        language,
        code,
      },
      {
        onSuccess: (result) => {
          if (!result.success) {
            console.error("Error submitting code:", result.error.message);
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState message="Problem not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Problems
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProblemStatement problem={problem} />

          <div>
            <CodeEditor
              language={language}
              code={code}
              onLanguageChange={setLanguage}
              onCodeChange={setCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={runCodeMutation.isPending}
              isSubmitting={submitCodeMutation.isPending}
            />

            {runCodeMutation.data?.success && (
              <RunResults result={runCodeMutation.data.data} />
            )}

            {runCodeMutation.data && !runCodeMutation.data.success && (
              <div className="mt-4">
                <ErrorState message={getErrorMessage(runCodeMutation.data)} />
              </div>
            )}

            {submitCodeMutation.data?.success && (
              <SubmitResults result={submitCodeMutation.data.data} />
            )}

            {submitCodeMutation.data && !submitCodeMutation.data.success && (
              <div className="mt-4">
                <ErrorState
                  message={getErrorMessage(submitCodeMutation.data)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
