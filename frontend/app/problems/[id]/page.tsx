"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Problem {
  id: number;
  slug: string;
  title: string;
  difficulty: string;
  tags: string[];
  statementMd: string;
  starterCode: {
    js: string;
    py: string;
  };
  samples: Array<{
    input: string;
    output: string;
  }>;
}

interface TestCaseResult {
  status: string;
  stdout: string;
  stderr: string;
  timeMs: number;
  expected?: string;
  got?: string;
}

interface RunResult {
  verdict: string;
  cases: TestCaseResult[];
}

export default function ProblemPage() {
  const params = useParams();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<"js" | "py">("js");
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<RunResult | null>(null);

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language]);
    }
  }, [problem, language]);

  const fetchProblem = async () => {
    try {
      const res = await fetch(`${API_URL}/problems/${problemId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch problem");
      }
      const data = await res.json();
      setProblem(data);
      setCode(data.starterCode.js);
    } catch (error) {
      console.error("Error fetching problem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    if (!problem) return;

    setRunning(true);
    setRunResult(null);

    try {
      const res = await fetch(`${API_URL}/judge/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          language,
          code,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to run code");
      }

      const result = await res.json();
      setRunResult(result);
    } catch (error) {
      console.error("Error running code:", error);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch(`${API_URL}/judge/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          language,
          code,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit code");
      }

      const result = await res.json();
      setSubmitResult(result);
    } catch (error) {
      console.error("Error submitting code:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "AC":
        return "text-green-600 bg-green-100";
      case "WA":
        return "text-red-600 bg-red-100";
      case "TLE":
        return "text-orange-600 bg-orange-100";
      case "RE":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AC":
        return "text-green-600";
      case "WA":
        return "text-red-600";
      case "TLE":
        return "text-orange-600";
      case "RE":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Problem not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Problems
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Statement */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {problem.title}
              </h1>
              <span
                className={`px-3 py-1 text-sm font-medium rounded ${
                  problem.difficulty === "Easy"
                    ? "text-green-600 bg-green-100"
                    : problem.difficulty === "Medium"
                      ? "text-yellow-600 bg-yellow-100"
                      : "text-red-600 bg-red-100"
                }`}
              >
                {problem.difficulty}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose max-w-none text-gray-900 [&_p]:text-gray-800 [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_strong]:text-gray-900 [&_code]:text-gray-900 [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre_code]:text-gray-100 [&_li]:text-gray-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {problem.statementMd}
              </ReactMarkdown>
            </div>

            {problem.samples.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  Sample Test Cases
                </h3>
                {problem.samples.map((sample, idx) => (
                  <div key={idx} className="mb-4 bg-gray-50 rounded p-4">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Input:
                      </span>
                      <pre className="mt-1 text-sm bg-white p-2 rounded border text-gray-900">
                        {sample.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Output:
                      </span>
                      <pre className="mt-1 text-sm bg-white p-2 rounded border text-gray-900">
                        {sample.output}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("js")}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    language === "js"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setLanguage("py")}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    language === "py"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Python
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {running ? "Running..." : "Run"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>

            <div className="border border-gray-300 rounded overflow-hidden">
              <MonacoEditor
                height="500px"
                language={language === "js" ? "javascript" : "python"}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                }}
              />
            </div>

            {/* Run Results */}
            {runResult && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">
                    Run Results:
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getVerdictColor(
                      runResult.verdict,
                    )}`}
                  >
                    {runResult.verdict}
                  </span>
                </div>
                <div className="space-y-2">
                  {runResult.cases.map((testCase, idx) => (
                    <div key={idx} className="bg-gray-50 rounded p-3 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          Test Case {idx + 1}:
                        </span>
                        <span className={getStatusColor(testCase.status)}>
                          {testCase.status}
                        </span>
                        <span className="text-gray-500">
                          ({testCase.timeMs}ms)
                        </span>
                      </div>
                      {testCase.stdout && (
                        <div className="mb-1">
                          <span className="text-gray-600">Output:</span>
                          <pre className="mt-1 bg-white p-2 rounded text-xs overflow-x-auto text-gray-900">
                            {testCase.stdout}
                          </pre>
                        </div>
                      )}
                      {testCase.stderr && (
                        <div className="mb-1">
                          <span className="text-red-600">Error:</span>
                          <pre className="mt-1 bg-red-50 p-2 rounded text-xs overflow-x-auto text-red-800">
                            {testCase.stderr}
                          </pre>
                        </div>
                      )}
                      {testCase.expected !== undefined && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-gray-600">Expected:</span>
                            <pre className="mt-1 bg-white p-2 rounded text-xs text-gray-900">
                              {testCase.expected}
                            </pre>
                          </div>
                          <div>
                            <span className="text-gray-600">Got:</span>
                            <pre className="mt-1 bg-white p-2 rounded text-xs text-gray-900">
                              {testCase.got}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Results */}
            {submitResult && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">
                    Submission Results:
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getVerdictColor(
                      submitResult.verdict,
                    )}`}
                  >
                    {submitResult.verdict}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {submitResult.verdict === "AC"
                    ? "All test cases passed! 🎉"
                    : `${submitResult.cases.length} test case(s) executed`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
