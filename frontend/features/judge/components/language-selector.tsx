import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  language: "js" | "py";
  onLanguageChange: (lang: "js" | "py") => void;
}

export function LanguageSelector({
  language,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onLanguageChange("js")}
        variant={language === "js" ? "default" : "outline"}
        size="sm"
      >
        JavaScript
      </Button>
      <Button
        onClick={() => onLanguageChange("py")}
        variant={language === "py" ? "default" : "outline"}
        size="sm"
      >
        Python
      </Button>
    </div>
  );
}
