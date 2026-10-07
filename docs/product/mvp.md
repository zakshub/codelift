# MVP Definition

## User problem

AI tools can produce useful frontend code without giving the user a conventional project that can be installed, built and developed locally.

## MVP promise

Turn a supported AI-generated React component/file into a runnable Vite project.

## Input

- TSX
- JSX

The initial parser should reject unsupported input clearly rather than silently producing a broken project.

## Output

A downloadable project containing only the files required to run the generated application, including as applicable:

- package.json
- index.html
- tsconfig files
- vite.config.ts
- src/main.tsx
- src/App.tsx
- src/index.css
- detected assets
- detected supporting source files

## Dependency handling

Dependencies should be derived from imports and known project conventions. Version resolution must be centralized so it can later be made deterministic.

## Definition of done

A conversion is not complete when files are generated.

It is complete when:

1. the project is generated;
2. dependencies resolve;
3. the project builds;
4. the ZIP is produced;
5. the user receives a clear result.
