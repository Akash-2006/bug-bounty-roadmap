import { z } from "zod";

/**
 * Fields shared by every persisted entity. `schemaVersion` is stamped per-record
 * to support forward migrations (ADR 0011); timestamps are epoch milliseconds.
 */
export const baseEntitySchema = z.object({
  id: z.string().min(1),
  schemaVersion: z.number().int().positive(),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type BaseEntity = z.infer<typeof baseEntitySchema>;

export const difficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);
export type DifficultyLevel = z.infer<typeof difficultySchema>;
