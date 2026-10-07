import test from "node:test";
import assert from "node:assert/strict";
import { validateProjectStructure, validateProject } from "../dist/index.js";

const validFiles = [
  { path: "package.json", content: JSON.stringify({
    dependencies: { react: "^19.0.0" },
    scripts: { dev: "vite", build: "vite build" }
  }) },
  { path: "index.html", content: "<div id=\"root\"></div>" },
  { path: "vite.config.ts", content: "export default {}" },
  { path: "src/main.tsx", content: "import App from './App'" },
  { path: "src/App.tsx", content: "export default function App() { return <div /> }" }
];

test("passes a structurally valid React project", () => {
  const result = validateProjectStructure(validFiles);
  assert.equal(result.status, "passed");
  assert.ok(result.checks.includes("required-file:package.json"));
  assert.ok(result.checks.includes("entry-component"));
});

test("reports missing required files", () => {
  const result = validateProjectStructure(validFiles.filter((file) => file.path !== "vite.config.ts"));
  assert.equal(result.status, "failed");
  assert.ok(result.diagnostics.some((item) => item.code === "MISSING_REQUIRED_FILE"));
});

test("reports invalid package.json", () => {
  const files = validFiles.map((file) =>
    file.path === "package.json" ? { ...file, content: "not json" } : file
  );
  const result = validateProjectStructure(files);
  assert.equal(result.status, "failed");
  assert.ok(result.diagnostics.some((item) => item.code === "INVALID_PACKAGE_JSON"));
});

test("delegates install/build verification to an isolated executor", async () => {
  let called = false;
  const result = await validateProject(validFiles, {
    async installAndBuild() {
      called = true;
      return { exitCode: 0, stdout: "built" };
    }
  });
  assert.equal(called, true);
  assert.equal(result.status, "passed");
  assert.ok(result.checks.includes("build:passed"));
});

test("reports executor build failure", async () => {
  const result = await validateProject(validFiles, {
    async installAndBuild() {
      return { exitCode: 1, stderr: "Module not found" };
    }
  });
  assert.equal(result.status, "failed");
  assert.ok(result.diagnostics.some((item) => item.code === "BUILD_FAILED"));
  assert.ok(result.checks.includes("build:failed"));
});
