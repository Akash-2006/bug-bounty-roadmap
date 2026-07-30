# 8. Provider-based Search and AI services

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

Search starts client-side (Fuse.js) but may move to a server index at scale. AI
features are designed now but wired later (bring-your-own-key, then a server
proxy). The UI must not depend on any specific implementation.

## Decision

Define `SearchProvider` and `AIProvider` interfaces. The MVP ships a
`FuseSearchProvider` and a `NoopAIProvider` (AI action slots are visible but
inert). Implementations are selected via a registry and can be swapped
(`ServerSearchProvider`, `OpenAIProvider`, `ProxyAIProvider`) with no UI change.

## Consequences

- Positive: AI/search implementations are pluggable and testable; UI is stable
  across upgrades; AI can ship incrementally (slots → BYOK → proxy).
- Negative: interfaces must anticipate streaming, cancellation, and rate limits.
- Neutral: provider capabilities are advertised via feature flags so the UI can
  hide/disable unsupported actions.

## Alternatives considered

- Hardcoding Fuse/OpenAI in components: blocks future backends and testing.
- Building a server now: contradicts the local-first MVP (ADR 0002).
