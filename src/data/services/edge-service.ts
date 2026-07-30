import { SCHEMA_VERSION } from "@/core/constants";
import { eventBus } from "@/core/events/event-bus";
import { createId } from "@/core/ids";
import type { CurriculumEdge, EdgeType } from "@/core/schemas/node";
import { edgeRepo } from "@/data/repositories/edge-repo";

/** Knowledge-graph edge use-cases (ADR 0006). Guards self-links and duplicates. */
export const edgeService = {
  list: edgeRepo.listByCurriculum,

  async create(
    workspaceId: string,
    curriculumId: string,
    fromNodeId: string,
    toNodeId: string,
    type: EdgeType,
  ): Promise<CurriculumEdge | null> {
    if (fromNodeId === toNodeId) return null;

    const existing = await edgeRepo.listByCurriculum(curriculumId);
    const dup = existing.find(
      (e) =>
        e.type === type &&
        e.fromNodeId === fromNodeId &&
        e.toNodeId === toNodeId,
    );
    if (dup) return null;

    const now = Date.now();
    const edge: CurriculumEdge = {
      id: createId(),
      schemaVersion: SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      workspaceId,
      curriculumId,
      fromNodeId,
      toNodeId,
      type,
    };
    await edgeRepo.save(edge);
    eventBus.emit("edge.created", { curriculumId, edgeId: edge.id });
    return edge;
  },

  async remove(curriculumId: string, id: string): Promise<void> {
    await edgeRepo.remove(id);
    eventBus.emit("edge.deleted", { curriculumId, edgeId: id });
  },
};
