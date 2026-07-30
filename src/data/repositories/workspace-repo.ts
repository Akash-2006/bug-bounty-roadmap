import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import type { Workspace } from "@/core/schemas/workspace";

/**
 * Persistence for workspaces (ADR 0005). The only code that reads/writes the
 * `workspaces` table. Contains no business rules — those live in services.
 */
export const workspaceRepo = {
  list(): Promise<Workspace[]> {
    return persistence.getAll<Workspace>("workspaces");
  },

  get(id: string): Promise<Workspace | undefined> {
    return persistence.get<Workspace>("workspaces", id);
  },

  save(workspace: Workspace): Promise<void> {
    return persistence.put("workspaces", workspace);
  },

  remove(id: string): Promise<void> {
    return persistence.delete("workspaces", id);
  },
};
