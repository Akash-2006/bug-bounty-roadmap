# 7. Internal event bus for decoupled workflows

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

Actions like completing a lesson or passing a quiz trigger several independent
reactions: XP calculation, achievement checks, streak updates, analytics, and
activity logging. Hard-wiring these into each action creates tight coupling and
makes features hard to add or remove.

## Decision

Provide a small, **typed internal event bus** in `core/events`. Services publish
domain events (`lesson.completed`, `quiz.passed`, `resource.added`, …).
Subscribers (XP, achievements, analytics, activity log) handle them
independently and may be registered by plugins (see ADR 0012). The bus is
synchronous-by-default with support for async subscribers.

## Consequences

- Positive: decoupled side-effects; new reactions added without touching the
  emitter; natural extension point for plugins and analytics.
- Negative: less explicit control flow; debugging requires event tracing.
- Neutral: events are typed and versioned; the log of emitted events aligns with
  the activity log (ADR 0010), easing a later move to event sourcing.

## Alternatives considered

- Direct function calls from services: explicit but tightly coupled.
- A heavyweight message broker: unnecessary for an in-process client app.
