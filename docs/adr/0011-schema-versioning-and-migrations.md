# 11. Schema versioning and forward migrations

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

The domain model will evolve. Local databases and exported files created by
older app versions must remain loadable after upgrades, without data loss.

## Decision

Stamp a **`schemaVersion`** on the persisted database and on every export file.
Maintain an ordered set of **forward migrations** in
`data/adapters/dexie/migrations`. On startup, the app runs any migrations needed
to bring stored data up to the current version. Import validates and migrates
incoming files by their declared `schemaVersion` before use.

## Consequences

- Positive: safe evolution of the model; old data and exports remain usable;
  clear upgrade path.
- Negative: every breaking model change requires a migration and tests.
- Neutral: migrations are forward-only; downgrades are not supported.

## Alternatives considered

- No versioning: silent breakage and data loss on model changes.
- Version detection by heuristic/shape-sniffing: fragile and error-prone.
