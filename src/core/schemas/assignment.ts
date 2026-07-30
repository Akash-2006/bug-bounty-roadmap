import { z } from "zod";

import { baseEntitySchema } from "@/core/schemas/base";

export const assignmentStatusSchema = z.enum([
  "todo",
  "in_progress",
  "done",
]);
export type AssignmentStatus = z.infer<typeof assignmentStatusSchema>;

/** A task/assignment attached to a lesson node. */
export const assignmentSchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1),
  curriculumId: z.string().min(1),
  nodeId: z.string().min(1),
  title: z.string().min(1).max(300),
  description: z.string().max(2000).optional(),
  status: assignmentStatusSchema,
  dueAt: z.number().int().nonnegative().nullable().optional(),
  xp: z.number().int().nonnegative().default(0),
  order: z.string().min(1),
});
export type Assignment = z.infer<typeof assignmentSchema>;

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  description: z.string().max(2000).optional(),
  dueAt: z.number().int().nonnegative().nullable().optional(),
  xp: z.number().int().nonnegative().default(0),
});
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

/** Cycle order used by the status toggle. */
export function nextStatus(status: AssignmentStatus): AssignmentStatus {
  return status === "todo"
    ? "in_progress"
    : status === "in_progress"
      ? "done"
      : "todo";
}
