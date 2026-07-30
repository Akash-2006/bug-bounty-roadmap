import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import type { CurriculumEdge } from "@/core/schemas/node";

/** Persistence for knowledge-graph edges (ADR 0004 / 0005). */
export const edgeRepo = {
  listByCurriculum(curriculumId: string): Promise<CurriculumEdge[]> {
    return persistence.where<CurriculumEdge>(
      "edges",
      "curriculumId",
      curriculumId,
    );
  },

  save(edge: CurriculumEdge): Promise<void> {
    return persistence.put("edges", edge);
  },

  remove(id: string): Promise<void> {
    return persistence.delete("edges", id);
  },
};
