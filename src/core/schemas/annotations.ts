import { z } from "zod";

import { baseEntitySchema } from "@/core/schemas/base";

/** A bookmark pinning a lesson node for quick access (one per node). */
export const bookmarkSchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1),
  curriculumId: z.string().min(1),
  nodeId: z.string().min(1),
});
export type Bookmark = z.infer<typeof bookmarkSchema>;

/** A personal free-form note attached to a lesson node (one per node). */
export const noteSchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1),
  curriculumId: z.string().min(1),
  nodeId: z.string().min(1),
  body: z.string().max(20000),
});
export type Note = z.infer<typeof noteSchema>;
