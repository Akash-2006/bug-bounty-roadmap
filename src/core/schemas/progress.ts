import { z } from "zod";

import { baseEntitySchema } from "@/core/schemas/base";

/** What kind of entity a progress/activity record points at. */
export const entityTypeSchema = z.enum(["node"]);
export type EntityType = z.infer<typeof entityTypeSchema>;

export const progressStatusSchema = z.enum([
  "not_started",
  "in_progress",
  "completed",
]);
export type ProgressStatus = z.infer<typeof progressStatusSchema>;

/**
 * A materialized progress record per entity (ADR 0010). One row per
 * (entityType, entityId); mirrors the append-only activity log.
 */
export const progressSchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1),
  curriculumId: z.string().min(1),
  entityType: entityTypeSchema,
  entityId: z.string().min(1),
  status: progressStatusSchema,
  score: z.number().min(0).max(100).optional(),
  completedAt: z.number().int().nonnegative().nullable().optional(),
});
export type ProgressRecord = z.infer<typeof progressSchema>;

/** Append-only activity types that drive XP, streaks, and analytics. */
export const activityTypeSchema = z.enum([
  "node.completed",
  "node.uncompleted",
]);
export type ActivityType = z.infer<typeof activityTypeSchema>;

export const activitySchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1),
  curriculumId: z.string().min(1).optional(),
  type: activityTypeSchema,
  entityType: entityTypeSchema.optional(),
  entityId: z.string().min(1).optional(),
  xp: z.number().int().default(0),
  at: z.number().int().nonnegative(),
});
export type Activity = z.infer<typeof activitySchema>;
