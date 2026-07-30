import { z } from "zod";

import { baseEntitySchema } from "@/core/schemas/base";

/** A top-level container that groups a user's curricula. */
export const workspaceSchema = baseEntitySchema.extend({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  icon: z.string().max(40).optional(),
  color: z.string().max(40).optional(),
});

export type Workspace = z.infer<typeof workspaceSchema>;

/** Payload for creating a workspace (server-managed fields omitted). */
export const createWorkspaceSchema = workspaceSchema.pick({
  name: true,
  description: true,
  icon: true,
  color: true,
});
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
