import { RunResult } from "../types/judge.types";
import { getVerdictColor } from "../utils/verdict-colors";
import { TestCaseResult } from "./test-case-result";

interface RunResultsProps {
  result: RunResult;
}

export function RunResults({ result }: RunResultsProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-gray-900">
          Run Results:
        </span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${getVerdictColor(
            result.verdict,
          )}`}
        >
          {result.verdict}
        </span>
      </div>
      <div className="space-y-2">
        {result.cases.map((testCase, idx) => (
          <TestCaseResult key={idx} testCase={testCase} index={idx} />
        ))}
      </div>
    </div>
  );
}
