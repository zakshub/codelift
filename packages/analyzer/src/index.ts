export type SourceLanguage = "typescript" | "javascript";
export type Framework = "react" | "unknown";
export type Styling = "tailwind" | "css" | "unknown";

export interface ImportInfo {
  source: string;
  isRelative: boolean;
}

export interface AnalysisResult {
  language: SourceLanguage;
  framework: Framework;
  styling: Styling;
  imports: ImportInfo[];
  dependencies: string[];
  hasReactDom: boolean;
  hasTypeScriptSyntax: boolean;
}

const IMPORT_RE =
  /(?:import\s+(?:[\s\S]*?\s+from\s+)?|export\s+(?:[\s\S]*?\s+from\s+))["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)/g;

function packageName(source: string): string | null {
  if (source.startsWith(".") || source.startsWith("/")) return null;
  if (source.startsWith("@")) {
    const parts = source.split("/");
    return parts.length >= 2 ? parts.slice(0, 2).join("/") : source;
  }
  return source.split("/")[0];
}

function detectImports(source: string): ImportInfo[] {
  const imports: ImportInfo[] = [];
  for (const match of source.matchAll(IMPORT_RE)) {
    const value = match[1] ?? match[2];
    if (!value) continue;
    imports.push({
      source: value,
      isRelative: value.startsWith(".") || value.startsWith("/")
    });
  }
  return imports;
}

export function analyzeSource(source: string, filename = "App.tsx"): AnalysisResult {
  const imports = detectImports(source);
  const dependencies = [...new Set(
    imports
      .map((item) => packageName(item.source))
      .filter((value): value is string => value !== null)
  )].sort();

  const isTsx = filename.endsWith(".tsx");
  const isTs = filename.endsWith(".ts");
  const hasTypeScriptSyntax =
    /:\s*[A-Za-z_$][\w$]*(?:<[^>]+>)?/.test(source) ||
    /\binterface\s+[A-Za-z_$][\w$]*/.test(source) ||
    /\btype\s+[A-Za-z_$][\w$]*\s*=/.test(source);

  const hasReact =
    /(?:from\s+|import\s*\(?\s*)["']react["']/.test(source) ||
    /<\/?[A-Z][A-Za-z0-9]*(?:\s|\/?>)/.test(source);

  const hasReactDom =
    dependencies.includes("react-dom") ||
    /from\s+["']react-dom(?:\/client)?["']/.test(source);

  const styling: Styling =
    /(?:from\s+)?["'](?:tailwindcss|@tailwindcss\/[^"']+)["']/.test(source) ||
    /@tailwind\s+(?:base|components|utilities)/.test(source) ||
    /className\s*=\s*["'][^"']*(?:flex|grid|text-|bg-|p-|m-|space-|items-|justify-)[^"']*["']/.test(source)
      ? "tailwind"
      : /\.css["']|\.scss["']|\.sass["']|\.less["']/.test(source)
        ? "css"
        : "unknown";

  return {
    language: isTsx || isTs || hasTypeScriptSyntax ? "typescript" : "javascript",
    framework: hasReact ? "react" : "unknown",
    styling,
    imports,
    dependencies,
    hasReactDom,
    hasTypeScriptSyntax
  };
}
