import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProblemDetail } from "../types/problem.types";
import { DifficultyBadge } from "@/shared/components/difficulty-badge";
import { TagList } from "@/shared/components/tag-list";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProblemStatementProps {
  problem: ProblemDetail;
}

export function ProblemStatement({ problem }: ProblemStatementProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold">{problem.title}</h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
      </CardHeader>
      <CardContent>
        <TagList tags={problem.tags} className="mb-6" />

        <div className="prose prose-neutral dark:prose-invert max-w-none [&_pre]:bg-muted [&_pre]:text-foreground [&_pre_code]:text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {problem.statementMd}
          </ReactMarkdown>
        </div>

        {problem.samples.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Sample Test Cases</h3>
            {problem.samples.map((sample, idx) => (
              <Card key={idx} className="mb-4">
                <CardContent className="p-4">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Input:
                    </span>
                    <pre className="mt-1 text-sm bg-muted p-2 rounded border">
                      {sample.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Output:
                    </span>
                    <pre className="mt-1 text-sm bg-muted p-2 rounded border">
                      {sample.output}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
