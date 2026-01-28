import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const getVerdictBadgeVariant = (verdict: string) => {
  switch (verdict) {
    case "AC":
      return "bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-500/20 dark:text-green-400";
    case "WA":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "TLE":
      return "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400";
    case "RE":
      return "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "AC":
      return "text-green-600 dark:text-green-400";
    case "WA":
      return "text-destructive";
    case "TLE":
      return "text-orange-600 dark:text-orange-400";
    case "RE":
      return "text-purple-600 dark:text-purple-400";
    default:
      return "text-muted-foreground";
  }
};
