import { SCHEMA_VERSION } from "@/core/constants";
import { eventBus } from "@/core/events/event-bus";
import { createId } from "@/core/ids";
import type { CreateWorkspaceInput, Workspace } from "@/core/schemas/workspace";
import { workspaceRepo } from "@/data/repositories/workspace-repo";

/**
 * Workspace use-cases (ADR 0006). Orchestrates the repository, stamps metadata,
 * and publishes domain events. UI calls services, not repositories, for writes.
 */
export const workspaceService = {
  list: workspaceRepo.list,
  get: workspaceRepo.get,

  async create(input: CreateWorkspaceInput): Promise<Workspace> {
    const now = Date.now();
    const workspace: Workspace = {
      id: createId(),
      schemaVersion: SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      name: input.name,
      description: input.description,
      icon: input.icon,
      color: input.color,
    };
    await workspaceRepo.save(workspace);
    eventBus.emit("workspace.created", { workspaceId: workspace.id });
    return workspace;
  },

  /** Ensure at least one workspace exists; returns the default one. */
  async ensureDefault(): Promise<Workspace> {
    const existing = await workspaceRepo.list();
    if (existing.length > 0) {
      return existing[0];
    }
    return this.create({ name: "My Workspace" });
  },
};
