# 3. Pluggable persistence adapters (Local / GitHub / Cloud)

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

Persistence needs will grow from local-only to cloud sync, GitHub-backed
Markdown, and collaboration. UI and business logic must not be coupled to any
specific storage technology.

## Decision

Define a `PersistenceAdapter` interface that all storage backends implement.
Repositories depend only on this interface. The MVP ships a `DexieAdapter`;
future `CloudAdapter` and `GitHubAdapter` implement the same contract. Adapter
selection is configuration, registered in a `persistenceAdapters` registry.

## Consequences

- Positive: storage backends are swappable/composable; v2 sync is an addition,
  not a rewrite; adapters are independently testable with fakes.
- Negative: an extra abstraction layer; the interface must be designed to cover
  future needs (batching, transactions, conflict metadata).
- Neutral: some adapters (GitHub) map imperfectly onto a generic CRUD contract
  and may need capability flags.

## Alternatives considered

- Calling Dexie directly from features: fastest now, painful to migrate later.
- A heavyweight ORM/sync framework: overkill for the MVP footprint.
