# 2. Local-first persistence with IndexedDB

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

Users must own their data, work offline, and experience instant interactions.
The MVP has no backend. We need durable, structured, queryable client storage
that can scale to large curricula (thousands of nodes) and later gain optional
cloud sync.

## Decision

Use **IndexedDB via Dexie** as the source of truth for the MVP. Data is stored
in normalized tables (one per aggregate) with indexes for tree and graph access
patterns. The app remains a static SPA deployable to any CDN. Cloud/GitHub sync
is added later behind the persistence adapter (see ADR 0003) without a rewrite.

## Consequences

- Positive: instant, offline, private, zero infrastructure cost; strong data
  ownership story; fast MVP.
- Negative: no multi-device or realtime collaboration until a sync layer exists;
  storage is per-browser-profile.
- Neutral: requires disciplined migrations (see ADR 0011).

## Alternatives considered

- `localStorage`: no indexing, string-only, small quota — unfit for structured
  data at scale.
- Backend-first (Supabase/Convex): enables sync/collab now but adds infra,
  cost, auth, and slows the MVP. Deferred to v2 via adapters.
