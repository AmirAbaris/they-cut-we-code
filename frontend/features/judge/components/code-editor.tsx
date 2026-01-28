"use client";

import dynamic from "next/dynamic";
import { LanguageSelector } from "./language-selector";
import { EditorActions } from "./editor-actions";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  language: "js" | "py";
  code: string;
  onLanguageChange: (lang: "js" | "py") => void;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

export function CodeEditor({
  language,
  code,
  onLanguageChange,
  onCodeChange,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
}: CodeEditorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <LanguageSelector
          language={language}
          onLanguageChange={onLanguageChange}
        />
        <EditorActions
          onRun={onRun}
          onSubmit={onSubmit}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
        />
      </div>

      <div className="border border-gray-300 rounded overflow-hidden">
        <MonacoEditor
          height="500px"
          language={language === "js" ? "javascript" : "python"}
          value={code}
          onChange={(value) => onCodeChange(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}
