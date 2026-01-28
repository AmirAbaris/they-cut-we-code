import { TestCaseResult as TestCaseResultType } from "../types/judge.types";
import { getStatusColor } from "../utils/verdict-colors";

interface TestCaseResultProps {
  testCase: TestCaseResultType;
  index: number;
}

export function TestCaseResult({ testCase, index }: TestCaseResultProps) {
  return (
    <div className="bg-gray-50 rounded p-3 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-gray-900">
          Test Case {index + 1}:
        </span>
        <span className={getStatusColor(testCase.status)}>
          {testCase.status}
        </span>
        <span className="text-gray-500">({testCase.timeMs}ms)</span>
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
  );
}
