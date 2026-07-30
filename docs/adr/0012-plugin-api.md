# 12. Lightweight plugin API

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

The product must be extensible: new content block renderers, AI actions,
templates, import/export formats, commands, and reactions to domain events —
ideally without modifying core code.

## Decision

Expose a small, **versioned Plugin API** that lets a plugin register into the
existing registries (block renderers, AI actions, templates, IO formats, command
palette) and subscribe to the event bus. A plugin is a module exporting a
`register(api)` function. The API surface is intentionally minimal for v1 and
grows deliberately; internal features are authored against the same API to keep
it honest ("dogfooding").

## Consequences

- Positive: features become pluggable; third-party/community extensions become
  possible later; core stays lean.
- Negative: the API is a compatibility contract that must be versioned and kept
  stable; security/sandboxing is required before enabling untrusted plugins.
- Neutral: v1 plugins are first-party and in-process; a sandboxed runtime is a
  later concern.

## Alternatives considered

- Hardcoded feature switches: simplest but not extensible.
- Full sandboxed plugin runtime now: premature; high complexity before product
  validation.
