# 6. Lightweight service layer for business logic

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

Many operations span multiple aggregates and side-effects. For example,
"complete a lesson" updates progress, appends an activity, awards XP, may unlock
achievements, and updates the streak. Placing this logic in components or
repositories would scatter and duplicate it.

## Decision

Add a **lightweight service layer** that orchestrates business use-cases across
repositories and publishes domain events (see ADR 0007). Services are plain,
framework-agnostic functions/classes (e.g. `LessonService.complete(nodeId)`).
Features call services for any non-trivial mutation; repositories stay focused
on persistence of a single aggregate.

## Consequences

- Positive: business rules live in one testable place; components stay thin;
  side-effects are coordinated, not ad hoc.
- Negative: another layer; risk of anemic services if overused for trivial CRUD
  (allowed to call repositories directly for simple reads/writes).
- Neutral: services depend on repositories and the event bus, not on React.

## Alternatives considered

- Logic in repositories: couples cross-aggregate rules to storage.
- Logic in components/hooks: untestable, duplicated, and hard to reuse.
