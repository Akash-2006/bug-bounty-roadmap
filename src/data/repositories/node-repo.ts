import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import { collectSubtreeIds } from "@/core/tree";
import type { CurriculumEdge, CurriculumNode } from "@/core/schemas/node";

/** Persistence for curriculum nodes and their subtree/edge cascade (ADR 0005). */
export const nodeRepo = {
  listByCurriculum(curriculumId: string): Promise<CurriculumNode[]> {
    return persistence.where<CurriculumNode>(
      "nodes",
      "curriculumId",
      curriculumId,
    );
  },

  get(id: string): Promise<CurriculumNode | undefined> {
    return persistence.get<CurriculumNode>("nodes", id);
  },

  save(node: CurriculumNode): Promise<void> {
    return persistence.put("nodes", node);
  },

  saveMany(nodes: CurriculumNode[]): Promise<void> {
    return persistence.bulkPut("nodes", nodes);
  },

  /** Delete a node, its descendants, and any edges touching the subtree. */
  async removeSubtree(curriculumId: string, nodeId: string): Promise<void> {
    const [nodes, edges] = await Promise.all([
      this.listByCurriculum(curriculumId),
      persistence.where<CurriculumEdge>("edges", "curriculumId", curriculumId),
    ]);
    const ids = new Set(collectSubtreeIds(nodes, nodeId));
    const edgeIds = edges
      .filter((e) => ids.has(e.fromNodeId) || ids.has(e.toNodeId))
      .map((e) => e.id);

    if (edgeIds.length) await persistence.bulkDelete("edges", edgeIds);
    await persistence.bulkDelete("nodes", [...ids]);
  },
};
