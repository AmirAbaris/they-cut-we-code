import { RunResult } from "../types/judge.types";
import { getVerdictBadgeVariant } from "../utils/verdict-colors";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SubmitResultsProps {
  result: RunResult;
}

export function SubmitResults({ result }: SubmitResultsProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold">Submission Results:</span>
        <Badge variant="outline" className={cn(getVerdictBadgeVariant(result.verdict))}>
          {result.verdict}
        </Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        {result.verdict === "AC"
          ? "All test cases passed! 🎉"
          : `${result.cases.length} test case(s) executed`}
      </div>
    </div>
  );
}
