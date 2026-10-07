import test from "node:test";
import assert from "node:assert/strict";
import { analyzeSource } from "../dist/index.js";

test("detects React, TypeScript and dependencies", () => {
  const result = analyzeSource(
    `import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import "./styles.css";

export default function App(): React.ReactNode {
  return <div className="flex items-center">Hello</div>;
}`,
    "App.tsx"
  );

  assert.equal(result.framework, "react");
  assert.equal(result.language, "typescript");
  assert.equal(result.hasReactDom, false);
  assert.deepEqual(result.dependencies, ["framer-motion", "lucide-react", "react"]);
  assert.equal(result.styling, "tailwind");
});
