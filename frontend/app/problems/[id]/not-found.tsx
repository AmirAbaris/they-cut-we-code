import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProblemNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/">← Back to Problems</Link>
          </Button>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Problem Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The problem you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/">Browse All Problems</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
