import { z } from "zod";

import { baseEntitySchema, difficultySchema } from "@/core/schemas/base";

/**
 * A node in the curriculum tree (ADR 0004). Containment is stored via
 * `parentId` + `order`; the `levelKey` ties the node to a level in the
 * curriculum's hierarchy scheme. Content-bearing nodes carry Markdown `body`
 * plus metadata (ADR 0009).
 */
export const nodeStatusSchema = z.enum([
  "not_started",
  "in_progress",
  "completed",
]);
export type NodeStatus = z.infer<typeof nodeStatusSchema>;

export const nodeSchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1),
  curriculumId: z.string().min(1),
  parentId: z.string().min(1).nullable(),
  levelKey: z.string().min(1),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(240),
  summary: z.string().max(600).optional(),
  order: z.string().min(1),
  /** Markdown body for content-bearing nodes (empty for structural nodes). */
  body: z.string().default(""),
  /** Frontmatter-style metadata. */
  difficulty: difficultySchema.optional(),
  estimatedMinutes: z.number().int().nonnegative().optional(),
  xp: z.number().int().nonnegative().default(0),
  tags: z.array(z.string()).default([]),
  objectives: z.array(z.string()).default([]),
});

export type CurriculumNode = z.infer<typeof nodeSchema>;

/** A first-class semantic edge in the knowledge graph (ADR 0004). */
export const edgeTypeSchema = z.enum([
  "prerequisite",
  "related",
  "unlocks",
  "resource",
]);
export type EdgeType = z.infer<typeof edgeTypeSchema>;

export const edgeSchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1),
  curriculumId: z.string().min(1),
  fromNodeId: z.string().min(1),
  toNodeId: z.string().min(1),
  type: edgeTypeSchema,
});

export type CurriculumEdge = z.infer<typeof edgeSchema>;

/** Payload for creating a node under an optional parent. */
export const createNodeSchema = z.object({
  parentId: z.string().min(1).nullable(),
  levelKey: z.string().min(1),
  title: z.string().min(1, "Give it a title").max(200),
  summary: z.string().max(600).optional(),
});
export type CreateNodeInput = z.infer<typeof createNodeSchema>;

/** Payload for updating a node's editable fields. */
export const updateNodeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  summary: z.string().max(600).optional(),
  body: z.string().optional(),
  difficulty: difficultySchema.optional(),
  estimatedMinutes: z.number().int().nonnegative().optional(),
  xp: z.number().int().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
});
export type UpdateNodeInput = z.infer<typeof updateNodeSchema>;
