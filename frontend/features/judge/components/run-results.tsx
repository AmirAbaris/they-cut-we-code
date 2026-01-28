import { RunResult } from "../types/judge.types";
import { getVerdictBadgeVariant } from "../utils/verdict-colors";
import { TestCaseResult } from "./test-case-result";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RunResultsProps {
  result: RunResult;
}

export function RunResults({ result }: RunResultsProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold">Run Results:</span>
        <Badge variant="outline" className={cn(getVerdictBadgeVariant(result.verdict))}>
          {result.verdict}
        </Badge>
      </div>
      <div className="space-y-2">
        {result.cases.map((testCase, idx) => (
          <TestCaseResult key={idx} testCase={testCase} index={idx} />
        ))}
      </div>
    </div>
  );
}
