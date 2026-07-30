import { z } from "zod";

/**
 * A configurable hierarchy scheme (ADR 0004). Instead of hardcoding
 * Semester → Module → Week → Lesson, each curriculum carries an ordered list of
 * level definitions. The last level is typically the content-bearing one.
 */
export const hierarchyLevelSchema = z.object({
  /** Stable key, e.g. "semester". */
  key: z.string().min(1).max(40),
  /** Singular label, e.g. "Semester". */
  singular: z.string().min(1).max(40),
  /** Plural label, e.g. "Semesters". */
  plural: z.string().min(1).max(40),
  /** Optional icon name. */
  icon: z.string().max(40).optional(),
});
export type HierarchyLevel = z.infer<typeof hierarchyLevelSchema>;

export const hierarchySchemeSchema = z.object({
  key: z.string().min(1).max(60),
  name: z.string().min(1).max(80),
  /** Ordered from outermost to innermost (content-bearing) level. */
  levels: z.array(hierarchyLevelSchema).min(1).max(8),
});
export type HierarchyScheme = z.infer<typeof hierarchySchemeSchema>;
