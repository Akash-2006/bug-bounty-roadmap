import { compareOrder } from "@/core/ordering";
import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import type { Assignment } from "@/core/schemas/assignment";

/** Persistence for assignments (ADR 0005). */
export const assignmentRepo = {
  async listByNode(nodeId: string): Promise<Assignment[]> {
    const rows = await persistence.where<Assignment>(
      "assignments",
      "nodeId",
      nodeId,
    );
    return rows.sort((a, b) => compareOrder(a.order, b.order));
  },

  listByWorkspace(workspaceId: string): Promise<Assignment[]> {
    return persistence.where<Assignment>(
      "assignments",
      "workspaceId",
      workspaceId,
    );
  },

  get(id: string): Promise<Assignment | undefined> {
    return persistence.get<Assignment>("assignments", id);
  },

  save(a: Assignment): Promise<void> {
    return persistence.put("assignments", a);
  },

  remove(id: string): Promise<void> {
    return persistence.delete("assignments", id);
  },
};
