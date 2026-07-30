# 4. Generic node tree + dual relationship model

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

The hierarchy must be user-configurable (e.g. Semester → Module → Week → Lesson,
or Chapter → Topic, or flat). The product is also a knowledge graph where
prerequisites, related topics, dependencies, and resources are first-class.
Fixed tables per level cannot express arbitrary hierarchies.

## Decision

Model the domain as a graph of generic **Nodes**. Each curriculum carries a
**HierarchyScheme** (ordered level definitions) describing what its node levels
mean. Two relationship kinds are stored, each optimized for its access pattern:

1. **Containment** — the hierarchy, stored as `parentId` + a fractional `order`
   on each node (cheap tree rendering, reordering by single-row update).
2. **Semantic edges** — a separate `edges` table with typed relationships
   (`prerequisite`, `related`, `unlocks`, `resource`) for the knowledge graph.

Content-bearing nodes hold a Markdown body (see ADR 0009).

## Consequences

- Positive: fully configurable hierarchies; graph relationships are first-class;
  tree and graph views each have an efficient query path.
- Negative: less compile-time specificity than fixed tables; the "relationship"
  concept exists in two places.
- Neutral: correctness (valid schemes, acyclic prerequisites) enforced in the
  `core` domain via Zod + graph algorithms.

## Alternatives considered

- Fixed tables per level: simplest, but violates the configurable-hierarchy
  requirement.
- Edges-only (no `parentId`): elegant but makes tree rendering expensive.
