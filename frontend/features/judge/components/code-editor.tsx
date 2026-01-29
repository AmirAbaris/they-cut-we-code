"use client";

import dynamic from "next/dynamic";
import { LanguageSelector } from "./language-selector";
import { EditorActions } from "./editor-actions";
import { Card, CardContent } from "@/components/ui/card";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  language: "js" | "py";
  code: string;
  hint?: string;
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
  hint,
  onLanguageChange,
  onCodeChange,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
}: CodeEditorProps) {
  return (
    <Card>
      <CardContent className="p-6">
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

        {hint ? (
          <div className="mb-3 rounded border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            {hint}
          </div>
        ) : null}

        <div className="border rounded overflow-hidden">
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
      </CardContent>
    </Card>
  );
}
