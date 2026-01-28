import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProblemDetail } from "../types/problem.types";
import { DifficultyBadge } from "@/shared/components/difficulty-badge";
import { TagList } from "@/shared/components/tag-list";

interface ProblemStatementProps {
  problem: ProblemDetail;
}

export function ProblemStatement({ problem }: ProblemStatementProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <TagList tags={problem.tags} className="mb-6" />

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
  );
}
