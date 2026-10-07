# Architecture Overview

## System boundary

CodeLift has four primary runtime areas:

1. Web — user interface, SEO pages, upload/paste workflow.
2. API — authentication, jobs, analysis requests, job status and downloads.
3. Worker — isolated project reconstruction and validation.
4. Storage — temporary artifacts and generated ZIP files.

## Conversion pipeline

```text
Input
  ↓
Source parser
  ↓
Framework detector
  ↓
Language detector
  ↓
Import analyzer
  ↓
Dependency resolver
  ↓
Asset/config detector
  ↓
Project generator
  ↓
Validator
  ↓
Repair loop (future)
  ↓
ZIP
```

## MVP boundary

The first implementation should deliberately support only:

- React
- TSX / JSX
- Vite
- TypeScript / JavaScript
- CSS
- Tailwind CSS
- dependency detection from imports

Do not add framework support merely to make the architecture look complete.

## Validation requirement

A generated project is considered successful only after the configured validation command completes successfully.

For the initial Vite target:

```bash
npm install
npm run build
```

The implementation must capture stdout/stderr and retain structured failure information for future repair.
