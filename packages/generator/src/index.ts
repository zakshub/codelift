import type { AnalysisResult } from "@codelift/analyzer";

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GeneratorInput {
  source: string;
  sourceFilename?: string;
  analysis: AnalysisResult;
}

function json(value: unknown): string {
  return JSON.stringify(value, null, 2) + "\n";
}

function packageJson(analysis: AnalysisResult): string {
  const dependencies: Record<string, string> = {
    react: "^19.1.0",
    "react-dom": "^19.1.0"
  };

  for (const dependency of analysis.dependencies) {
    if (dependency === "react" || dependency === "react-dom") continue;
    dependencies[dependency] = "latest";
  }

  return json({
    name: "codelift-generated-app",
    private: true,
    version: "0.1.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc -b && vite build",
      preview: "vite preview"
    },
    dependencies,
    devDependencies: {
      "@vitejs/plugin-react": "^5.0.0",
      typescript: "^5.9.0",
      vite: "^7.1.0"
    }
  });
}

function tsconfig(): string {
  return json({
    files: [],
    references: [
      { path: "./tsconfig.app.json" },
      { path: "./tsconfig.node.json" }
    ]
  });
}

function appTsconfig(): string {
  return json({
    compilerOptions: {
      tsBuildInfoFile: "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
      target: "ES2022",
      useDefineForClassFields: true,
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      allowJs: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      module: "ESNext",
      moduleResolution: "Bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx"
    },
    include: ["src"]
  });
}

function nodeTsconfig(): string {
  return json({
    compilerOptions: {
      tsBuildInfoFile: "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
      target: "ES2023",
      lib: ["ES2023"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "Bundler",
      allowImportingTsExtensions: true,
      isolatedModules: true,
      moduleDetection: "force",
      noEmit: true,
      strict: true
    },
    include: ["vite.config.ts"]
  });
}

function viteConfig(): string {
  return `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});
`;
}

function indexHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeLift Generated App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function mainFile(): string {
  return `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;
}

function cssFile(): string {
  return `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

:root {
  font-family: Inter, system-ui, sans-serif;
  color: #111827;
  background: #ffffff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}
`;
}

export function generateProject(input: GeneratorInput): GeneratedFile[] {
  const filename = input.sourceFilename ?? "App.tsx";
  const extension = filename.endsWith(".jsx") ? ".jsx" : ".tsx";
  const appPath = `src/App${extension}`;

  return [
    { path: "package.json", content: packageJson(input.analysis) },
    { path: "index.html", content: indexHtml() },
    { path: "tsconfig.json", content: tsconfig() },
    { path: "tsconfig.app.json", content: appTsconfig() },
    { path: "tsconfig.node.json", content: nodeTsconfig() },
    { path: "vite.config.ts", content: viteConfig() },
    { path: "src/main.tsx", content: mainFile() },
    { path: appPath, content: input.source },
    { path: "src/index.css", content: cssFile() }
  ];
}
