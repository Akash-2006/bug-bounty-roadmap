import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import type { ProgressRecord } from "@/core/schemas/progress";

/** Persistence for the materialized progress table (ADR 0005 / 0010). */
export const progressRepo = {
  listByWorkspace(workspaceId: string): Promise<ProgressRecord[]> {
    return persistence.where<ProgressRecord>(
      "progress",
      "workspaceId",
      workspaceId,
    );
  },

  async getByEntity(entityId: string): Promise<ProgressRecord | undefined> {
    const rows = await persistence.where<ProgressRecord>(
      "progress",
      "entityId",
      entityId,
    );
    return rows[0];
  },

  save(record: ProgressRecord): Promise<void> {
    return persistence.put("progress", record);
  },

  removeByEntity(entityId: string): Promise<void> {
    return persistence.deleteWhere("progress", "entityId", entityId);
  },
};
