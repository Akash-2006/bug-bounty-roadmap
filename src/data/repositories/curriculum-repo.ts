import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import { compareOrder } from "@/core/ordering";
import type { Curriculum } from "@/core/schemas/curriculum";

/** Persistence for curricula and their cascade cleanup (ADR 0005). */
export const curriculumRepo = {
  async listByWorkspace(workspaceId: string): Promise<Curriculum[]> {
    const rows = await persistence.where<Curriculum>(
      "curricula",
      "workspaceId",
      workspaceId,
    );
    return rows.sort((a, b) => compareOrder(a.order, b.order));
  },

  get(id: string): Promise<Curriculum | undefined> {
    return persistence.get<Curriculum>("curricula", id);
  },

  save(curriculum: Curriculum): Promise<void> {
    return persistence.put("curricula", curriculum);
  },

  /** Remove a curriculum and cascade-delete its nodes and edges. */
  async remove(id: string): Promise<void> {
    await persistence.deleteWhere("nodes", "curriculumId", id);
    await persistence.deleteWhere("edges", "curriculumId", id);
    await persistence.delete("curricula", id);
  },
};
