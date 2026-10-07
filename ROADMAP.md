# CodeLift Roadmap

## Phase 0 — Research
- [ ] Validate product positioning
- [ ] Research competing artifact/project converters
- [ ] Validate brand and domain availability
- [ ] Build keyword/SERP dataset
- [ ] Document the initial SEO hypothesis

## Phase 1 — Foundation
- [ ] Monorepo structure
- [ ] Web application
- [ ] API service
- [ ] Worker service
- [ ] Shared types
- [ ] Local development with Docker Compose
- [ ] Basic CI

## Phase 2 — MVP conversion
- [ ] Accept TSX/JSX
- [ ] Parse source
- [ ] Detect React
- [ ] Detect TypeScript/JavaScript
- [ ] Detect imports
- [ ] Detect CSS/Tailwind usage
- [ ] Generate Vite project
- [ ] Generate package.json
- [ ] Generate required configuration
- [ ] Produce ZIP

## Phase 3 — Validation
- [ ] Install dependencies in an isolated worker
- [ ] Run build
- [ ] Capture build output
- [ ] Verify generated project
- [ ] Expose validation status to the user

## Phase 4 — Repair
- [ ] Classify build errors
- [ ] Generate repair patches
- [ ] Retry build
- [ ] Limit repair attempts
- [ ] Report what was repaired

## Phase 5 — Ecosystem support
- [ ] Claude Artifacts
- [ ] Gemini Canvas
- [ ] v0 exports
- [ ] Multi-file AI-generated projects
- [ ] Next.js
- [ ] Vue
- [ ] Svelte
- [ ] Astro

## Phase 6 — SEO and growth
- [ ] Tool landing pages
- [ ] Search-intent guides
- [ ] Comparison pages where evidence exists
- [ ] Search Console
- [ ] Analytics event funnel
- [ ] Internal-link system
- [ ] Content experiments based on actual search data

## Product success criteria

1. A user can submit AI-generated frontend code.
2. CodeLift reconstructs the required project.
3. The generated project installs successfully.
4. The generated project builds successfully.
5. The user can download and run it locally.
