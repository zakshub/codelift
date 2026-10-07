import test from "node:test";
import assert from "node:assert/strict";
import { generateProject } from "../dist/index.js";

const analysis = {
  language: "typescript",
  framework: "react",
  styling: "css",
  imports: [{ source: "react", isRelative: false }],
  dependencies: ["react"],
  hasReactDom: false,
  hasTypeScriptSyntax: true
};

test("generates a minimal Vite React project", () => {
  const files = generateProject({
    source: "export default function App() { return <main>Hello</main>; }",
    sourceFilename: "App.tsx",
    analysis
  });

  const paths = files.map((file) => file.path);

  assert.deepEqual(paths, [
    "package.json",
    "index.html",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "vite.config.ts",
    "src/main.tsx",
    "src/App.tsx",
    "src/index.css"
  ]);

  const pkg = JSON.parse(files.find((file) => file.path === "package.json").content);
  assert.equal(pkg.scripts.build, "tsc -b && vite build");
  assert.equal(pkg.dependencies.react, "^19.1.0");
});
