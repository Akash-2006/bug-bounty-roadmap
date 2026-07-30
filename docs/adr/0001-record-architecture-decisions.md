# 1. Record architecture decisions

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

The platform is a configurable, local-first, content-driven learning product
intended to scale to 100,000+ users and evolve through many phases (local
storage → cloud sync → GitHub → collaboration → AI). Decisions made early have
long-lived consequences and need to be discoverable by future contributors.

## Decision

We will use Architecture Decision Records (ADRs) to document significant
architectural decisions. Each ADR uses a minimal template: Context, Decision,
Consequences, and Alternatives considered. ADRs live in `docs/adr`, are numbered
sequentially, and are immutable once accepted. A superseding ADR is created when
a decision is reversed.

## Consequences

- Positive: shared, versioned rationale; faster onboarding; fewer relitigated
  debates.
- Negative: a small amount of upfront writing per major decision.
- Neutral: ADRs describe intent at a point in time, not current code.

## Alternatives considered

- Wiki/Notion pages: drift from the codebase, not versioned with the source.
- No formal record: institutional knowledge lost as the team grows.
