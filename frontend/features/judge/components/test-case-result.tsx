import { TestCaseResult as TestCaseResultType } from "../types/judge.types";
import { getStatusColor } from "../utils/verdict-colors";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TestCaseResultProps {
  testCase: TestCaseResultType;
  index: number;
}

export function TestCaseResult({ testCase, index }: TestCaseResultProps) {
  return (
    <Card>
      <CardContent className="p-3 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium">Test Case {index + 1}:</span>
          <span className={cn("font-medium", getStatusColor(testCase.status))}>
            {testCase.status}
          </span>
          <span className="text-muted-foreground">({testCase.timeMs}ms)</span>
        </div>
        {testCase.stdout && (
          <div className="mb-1">
            <span className="text-muted-foreground">Output:</span>
            <pre className="mt-1 bg-muted p-2 rounded text-xs overflow-x-auto">
              {testCase.stdout}
            </pre>
          </div>
        )}
        {testCase.stderr && (
          <div className="mb-1">
            <span className="text-destructive">Error:</span>
            <pre className="mt-1 bg-destructive/10 p-2 rounded text-xs overflow-x-auto text-destructive">
              {testCase.stderr}
            </pre>
          </div>
        )}
        {testCase.expected !== undefined && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <span className="text-muted-foreground">Expected:</span>
              <pre className="mt-1 bg-muted p-2 rounded text-xs">
                {testCase.expected}
              </pre>
            </div>
            <div>
              <span className="text-muted-foreground">Got:</span>
              <pre className="mt-1 bg-muted p-2 rounded text-xs">
                {testCase.got}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
