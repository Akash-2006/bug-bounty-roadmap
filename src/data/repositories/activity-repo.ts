import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import type { Activity } from "@/core/schemas/progress";

/** Persistence for the append-only activity log (ADR 0010). */
export const activityRepo = {
  listByWorkspace(workspaceId: string): Promise<Activity[]> {
    return persistence.where<Activity>("activities", "workspaceId", workspaceId);
  },

  append(activity: Activity): Promise<void> {
    return persistence.put("activities", activity);
  },

  removeByEntity(entityId: string): Promise<void> {
    return persistence.deleteWhere("activities", "entityId", entityId);
  },
};
