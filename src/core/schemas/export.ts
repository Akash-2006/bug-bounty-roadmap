import { z } from "zod";

import { curriculumSchema } from "@/core/schemas/curriculum";
import { nodeSchema } from "@/core/schemas/node";
import { activitySchema, progressSchema } from "@/core/schemas/progress";

/**
 * The portable export envelope (ADR 0009 / 0011). Every export is stamped with
 * `schemaVersion` and validated by Zod on import so old files remain loadable.
 */
export const exportEnvelopeSchema = z.object({
  format: z.literal("bbu-export"),
  schemaVersion: z.number().int().positive(),
  exportedAt: z.number().int().nonnegative(),
  scope: z.enum(["workspace", "curriculum"]),
  curricula: z.array(curriculumSchema),
  nodes: z.array(nodeSchema),
  progress: z.array(progressSchema).default([]),
  activities: z.array(activitySchema).default([]),
});

export type ExportEnvelope = z.infer<typeof exportEnvelopeSchema>;
