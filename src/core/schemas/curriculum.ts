import { z } from "zod";

import { baseEntitySchema } from "@/core/schemas/base";
import { hierarchySchemeSchema } from "@/core/schemas/hierarchy";

/** A curriculum: a self-contained learning universe within a workspace. */
export const curriculumSchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1),
  title: z.string().min(1).max(160),
  slug: z.string().min(1).max(200),
  summary: z.string().max(600).optional(),
  icon: z.string().max(40).optional(),
  color: z.string().max(40).optional(),
  /** The configurable hierarchy this curriculum uses (embedded for MVP). */
  scheme: hierarchySchemeSchema,
  /** Ordering key among sibling curricula. */
  order: z.string().min(1),
  archivedAt: z.number().int().nonnegative().nullable().optional(),
});

export type Curriculum = z.infer<typeof curriculumSchema>;

export const createCurriculumSchema = z.object({
  title: z.string().min(1, "Give your curriculum a title").max(160),
  summary: z.string().max(600).optional(),
  icon: z.string().max(40).optional(),
  color: z.string().max(40).optional(),
  schemeKey: z.string().min(1),
});
export type CreateCurriculumInput = z.infer<typeof createCurriculumSchema>;

export const updateCurriculumSchema = z.object({
  title: z.string().min(1).max(160).optional(),
  summary: z.string().max(600).optional(),
  icon: z.string().max(40).optional(),
  color: z.string().max(40).optional(),
  archivedAt: z.number().int().nonnegative().nullable().optional(),
});
export type UpdateCurriculumInput = z.infer<typeof updateCurriculumSchema>;
