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
import { ErrorState } from "@/shared/components/error-state";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { getErrorMessage } from "@/shared/utils/api-error";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <ThemeToggle />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-[500px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState message="Problem not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            ← Back to Problems
          </Link>
          <ThemeToggle />
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
