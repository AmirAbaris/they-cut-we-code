"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BrandDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          ?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>They Cut, We Code</DialogTitle>
          <DialogDescription>
            It’s not just a sentence — it’s the engineering mindset.
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm leading-relaxed space-y-3">
          <p>
            When the situation gets bad, engineers don’t wait for perfect
            conditions. We reduce the problem, isolate constraints, and ship a
            path forward.
          </p>
          <p>
            No shortcuts, no excuses — just fundamentals: clarity, resilience,
            and iteration.
          </p>
          <p className="font-medium">
            They cut. We code. We always find a way.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
