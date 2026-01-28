import { RunResult } from "../types/judge.types";
import { getVerdictColor } from "../utils/verdict-colors";

interface SubmitResultsProps {
  result: RunResult;
}

export function SubmitResults({ result }: SubmitResultsProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-gray-900">
          Submission Results:
        </span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${getVerdictColor(
            result.verdict,
          )}`}
        >
          {result.verdict}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        {result.verdict === "AC"
          ? "All test cases passed! 🎉"
          : `${result.cases.length} test case(s) executed`}
      </div>
    </div>
  );
}
