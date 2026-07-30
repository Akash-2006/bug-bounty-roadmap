# Bug Bounty University

A content-driven learning platform for a self-directed bug bounty / web
security curriculum — replacing an Obsidian vault as the primary study
tool while still using Markdown as the source of truth for lesson content.

## Stack

React · Vite · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui ·
React Router (data mode) · React Markdown · Mermaid · Prism · Framer
Motion · Zustand · Fuse.js · Recharts

## Architecture

```
src/
  app/             # router config, root shell/layout
  components/      # reusable, presentation-only UI (incl. shadcn primitives)
  features/        # feature-scoped logic + components (dashboard, progress, search, ...)
  content-engine/  # markdown loading, manifest generation, mermaid/prism integration
  stores/          # zustand state slices
  lib/             # pure utility functions
  types/           # shared TypeScript types
content/           # the actual Markdown curriculum (added in a later phase)
```

Content is never hardcoded into components. The content hierarchy is
Semester → Module → Week → Lesson, and every layer of the UI is built
against that shape now — using mock data in Phase 1 — so wiring in the
real Markdown-driven content engine later is a data-layer change, not
a UI rewrite.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # typecheck + production build
npm run lint     # oxlint
```

## Status

Built incrementally in phases, committed directly to this repository.

- [x] Phase 1 — project scaffold, Tailwind/shadcn config, routing,
      application shell, responsive roadmap-tree sidebar, dashboard
- [ ] Phase 2 — content engine (Markdown loading + manifest generation)
- [ ] Phase 3 — progress tracking, XP/achievements, bookmarks, notes
- [ ] Phase 4 — search, assignment/lab trackers, statistics dashboard
- [ ] Phase 5 — polish pass (motion, empty/error states, keyboard nav)
