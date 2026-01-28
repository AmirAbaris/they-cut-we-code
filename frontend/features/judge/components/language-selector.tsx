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
      <button
        onClick={() => onLanguageChange("js")}
        className={`px-4 py-2 text-sm font-medium rounded ${
          language === "js"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        JavaScript
      </button>
      <button
        onClick={() => onLanguageChange("py")}
        className={`px-4 py-2 text-sm font-medium rounded ${
          language === "py"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Python
      </button>
    </div>
  );
}
