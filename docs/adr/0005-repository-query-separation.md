# 5. Repository + query-cache separation

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

The UI needs cached, reactive, optimistic data access, while the domain needs a
clean, technology-agnostic way to read and write aggregates. Mixing these
concerns leads to tangled components and hard-to-test logic.

## Decision

Introduce **Repositories** (one per aggregate: Node, Edge, Resource, Quiz,
Activity, Progress, …) as the only code that talks to the persistence adapter.
Wrap repository calls in **TanStack Query** hooks (`data/queries`) for caching,
invalidation, and optimistic updates. UI/features consume query hooks (reads)
and services (writes), never the adapter directly.

## Consequences

- Positive: clear read/write path; optimistic UX; swapping adapters or storage
  never touches components; repositories are unit-testable with fake adapters.
- Negative: more layers/boilerplate than direct data access.
- Neutral: cache invalidation keys must be designed deliberately per aggregate.

## Alternatives considered

- Components query storage directly: fast but untestable and brittle.
- A single global store holding all durable data: memory pressure and manual
  cache management at scale.
