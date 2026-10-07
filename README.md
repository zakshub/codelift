# CodeLift

CodeLift is a tool for turning AI-generated frontend code into complete, runnable projects.

## Core pipeline

AI-generated code → Analyze → Detect → Reconstruct → Validate → Repair → Download

## Current MVP target

- Input: React TSX / JSX
- Language: TypeScript / JavaScript
- Build system: Vite
- Styling: CSS / Tailwind CSS
- Dependency detection from imports
- Project reconstruction
- Build validation
- ZIP export

## Product principle

CodeLift must produce projects that actually build. Generating a plausible file tree is not enough.

## Repository structure

```text
apps/
  web/          # Product UI and SEO website
  api/          # API
  worker/       # Isolated conversion/build worker

packages/
  parser/       # Source parsing
  analyzer/     # Project analysis
  detector/     # Framework/dependency/config detection
  generator/    # Project generation
  validator/    # Install/build validation
  repair/       # Future automated build repair
  shared/       # Shared types/utilities

docs/
  product/
  architecture/
  security/
  seo/
```

## Status

Early foundation. The brand/domain remains provisional until naming and domain research is complete.
