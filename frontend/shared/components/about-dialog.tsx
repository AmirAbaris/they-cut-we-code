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

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          About
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About</DialogTitle>
          <DialogDescription>
            Built by Amir Abaris and Ali Zoghi.
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm leading-relaxed space-y-4">
          <p>
            This is a mini LeetCode-style platform you can run locally to
            practice algorithm problems, even during long internet shutdowns.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
