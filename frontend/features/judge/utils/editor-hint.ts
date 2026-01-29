export type JudgeLanguage = "js" | "py";

export function buildEditorHint(
  language: JudgeLanguage,
  starter: string,
): string | undefined {
  const stopMarker =
    language === "js" ? "// Your solution here" : "# Your solution here";
  const before = starter.includes(stopMarker)
    ? starter.split(stopMarker)[0]
    : starter;

  const ignore = new Set([
    "fs",
    "readline",
    "rl",
    "input",
    "lines",
    "json",
    "sys",
    "f",
    "result",
  ]);

  const vars = new Set<string>();

  if (language === "js") {
    const re = /^\s*(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(before)) !== null) {
      const name = m[1];
      if (!ignore.has(name)) vars.add(name);
    }
  } else {
    const re = /^\s*([A-Za-z_]\w*)\s*=/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(before)) !== null) {
      const name = m[1];
      if (!ignore.has(name)) vars.add(name);
    }
  }

  const inputs = Array.from(vars);

  let outputStyle: string | undefined;
  if (language === "js") {
    const m = starter.match(/console\.log\((.+)\)\s*;?/);
    if (m?.[1])
      outputStyle = m[1].includes("JSON.stringify")
        ? "JSON.stringify(result)"
        : "result";
  } else {
    const m = starter.match(/print\((.+)\)\s*$/m);
    if (m?.[1])
      outputStyle = m[1].includes("json.dumps")
        ? "json.dumps(result)"
        : "result";
  }

  const inputsPart = inputs.length
    ? `Your inputs are provided as: ${inputs.map((v) => `\`${v}\``).join(", ")}.`
    : "Your inputs are already provided above.";

  const outputPart =
    language === "js"
      ? `Put the final answer in \`result\` (don’t \`console.log\`). We'll print ${
          outputStyle ? `\`${outputStyle}\`` : "`result`"
        } for you.`
      : `Put the final answer in \`result\` (don’t \`print\`). We'll print ${
          outputStyle ? `\`${outputStyle}\`` : "`result`"
        } for you.`;

  return `${inputsPart} ${outputPart}`;
}
