# 9. Markdown + frontmatter as canonical content

- Status: Accepted
- Date: 2026-07-30
- Deciders: Founding team

## Context

Lesson content must be portable, Git-friendly, and exportable to Markdown and
Obsidian. An earlier proposal used structured `sections[]` blocks; the team
chose Markdown as the single canonical representation.

## Decision

Each content-bearing node stores one **Markdown body** plus **structured
frontmatter** (metadata: title, difficulty, estimated time, XP, tags,
objectives, status, relationships). The serializer maps frontmatter ⇄ node
metadata. Export produces one `.md` file per node with YAML frontmatter; import
parses the same format.

## Consequences

- Positive: portable and Git-friendly; trivial Obsidian/Markdown import/export;
  a single source of truth for content; simpler editor.
- Negative: less structured than typed blocks; rich block behaviors are achieved
  via Markdown extensions/directives rendered by the block registry.
- Neutral: metadata validated by Zod on import to reject malformed frontmatter.

## Alternatives considered

- `sections[]` blocks: more structured/Notion-like but harder to serialize to a
  clean Markdown file and less portable.
