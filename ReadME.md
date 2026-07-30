# Bug Bounty University

A production-quality, content-driven learning platform for offensive security —
from HTTP fundamentals to advanced web exploitation. Built to feel like a blend
of Obsidian, roadmap.sh, Frontend Masters, and PortSwigger Academy.

> **Status:** Phase 1 — application shell, responsive sidebar, and dashboard.

## Tech stack

| Concern        | Choice                          |
| -------------- | ------------------------------- |
| Framework      | React 18 + TypeScript           |
| Build tool     | Vite 6                          |
| Styling        | Tailwind CSS + shadcn/ui tokens |
| Routing        | React Router 6                  |
| State          | Zustand (persisted)             |
| Charts         | Recharts                        |
| Animation      | Framer Motion                   |
| Icons          | lucide-react                    |

## Architecture

Content is **not** hardcoded. Lesson bodies live as Markdown under `content/`
and are loaded lazily via Vite's `import.meta.glob`. The curriculum *structure*
(Semester → Module → Week → Lesson) is described by typed metadata.

```
content/                     Markdown lesson bodies (authored, not code)
src/
  app/                       Providers, router, bootstrap
  components/
    ui/                      shadcn/ui primitives
    layout/                  AppShell, Sidebar, Topbar
    common/                  Shared building blocks
  config/                    Navigation config
  content/                   Curriculum index + Markdown loader
  features/                  Feature modules (dashboard, …)
  hooks/                     Shared hooks
  lib/                       Framework-agnostic utilities
  stores/                    Zustand stores (theme, UI)
  styles/                    Global CSS + design tokens
  types/                     Domain model types
```

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start the dev server               |
| `npm run build`     | Type-check and build for production |
| `npm run preview`   | Preview the production build       |
| `npm run typecheck` | Type-check without emitting        |

## Roadmap

- **Phase 1** — App shell, sidebar, dashboard, theming. ✅
- **Phase 2** — Curriculum explorer + Markdown/Mermaid/Prism lesson renderer.
- **Phase 3** — Progress tracking, XP, achievements, statistics.
- **Phase 4** — Search, bookmarks, notes, command palette.
