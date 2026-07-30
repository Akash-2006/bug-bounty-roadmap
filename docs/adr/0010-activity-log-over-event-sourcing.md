# 10. Activity log over full event sourcing (v1)

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

Gamification (XP, streaks, achievements) and analytics need a history of what
the user did. Full event sourcing (rebuilding all state purely from an event
stream) is powerful but heavy for a v1 client app.

## Decision

For v1, use an **append-only activity log** plus a **materialized `progress`
table**. Services append activities (`lesson.completed`, `quiz.passed`,
`study.tick`, …) and update progress directly. XP, streaks, and stats are
computed from progress + the activity log. The design stays compatible with a
future move to full event sourcing because the activity log already captures the
event stream.

## Consequences

- Positive: simpler than full event sourcing; history retained for analytics and
  achievements; sync-friendly append-only structure.
- Negative: progress is materialized, so it must be kept consistent with the log
  by the service layer.
- Neutral: if strong auditability/replay is needed later, promote the activity
  log to the authoritative event store.

## Alternatives considered

- Plain counters: simplest, but lossy — no history, weak analytics.
- Full event sourcing now: maximal flexibility, disproportionate complexity for
  a local-first MVP.
