# Architecture Decision Records

This directory records the significant architectural decisions for the platform
using lightweight ADRs (Architecture Decision Records).

Each ADR captures the **context**, the **decision**, and the **consequences**
(including trade-offs and alternatives considered) at the time it was made.
ADRs are immutable once accepted; if a decision changes, a new ADR supersedes
the old one.

## Format

We follow a minimal Michael Nygard–style template. See
[0001](0001-record-architecture-decisions.md).

## Index

| ADR | Title | Status |
| --- | ----- | ------ |
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](0002-local-first-persistence.md) | Local-first persistence with IndexedDB | Accepted |
| [0003](0003-persistence-adapter-pattern.md) | Pluggable persistence adapters (Local / GitHub / Cloud) | Accepted |
| [0004](0004-generic-node-tree-and-graph.md) | Generic node tree + dual relationship model | Accepted |
| [0005](0005-repository-query-separation.md) | Repository + query-cache separation | Accepted |
| [0006](0006-service-layer.md) | Lightweight service layer for business logic | Accepted |
| [0007](0007-internal-event-bus.md) | Internal event bus for decoupled workflows | Accepted |
| [0008](0008-provider-based-search-and-ai.md) | Provider-based Search and AI services | Accepted |
| [0009](0009-markdown-canonical-content.md) | Markdown + frontmatter as canonical content | Accepted |
| [0010](0010-activity-log-over-event-sourcing.md) | Activity log over full event sourcing (v1) | Accepted |
| [0011](0011-schema-versioning-and-migrations.md) | Schema versioning and forward migrations | Accepted |
| [0012](0012-plugin-api.md) | Lightweight plugin API | Accepted |
