import { SCHEMA_VERSION } from "@/core/constants";
import { eventBus } from "@/core/events/event-bus";
import { createId } from "@/core/ids";
import type { CurriculumNode } from "@/core/schemas/node";
import type { ProgressRecord } from "@/core/schemas/progress";
import { activityRepo } from "@/data/repositories/activity-repo";
import { progressRepo } from "@/data/repositories/progress-repo";

/**
 * Completion use-cases (ADR 0006 / 0010). Marking a node complete updates the
 * materialized progress row AND appends to the activity log, which drives XP
 * and streaks. Un-completing removes both so aggregates recompute cleanly.
 */
export const progressService = {
  listByWorkspace: progressRepo.listByWorkspace,
  getByEntity: progressRepo.getByEntity,

  async setComplete(node: CurriculumNode, complete: boolean): Promise<void> {
    const now = Date.now();

    if (complete) {
      const existing = await progressRepo.getByEntity(node.id);
      const record: ProgressRecord = {
        id: existing?.id ?? createId(),
        schemaVersion: SCHEMA_VERSION,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        workspaceId: node.workspaceId,
        curriculumId: node.curriculumId,
        entityType: "node",
        entityId: node.id,
        status: "completed",
        completedAt: now,
      };
      await progressRepo.save(record);
      await activityRepo.append({
        id: createId(),
        schemaVersion: SCHEMA_VERSION,
        createdAt: now,
        updatedAt: now,
        workspaceId: node.workspaceId,
        curriculumId: node.curriculumId,
        type: "node.completed",
        entityType: "node",
        entityId: node.id,
        xp: node.xp,
        at: now,
      });
      eventBus.emit("node.completed", {
        curriculumId: node.curriculumId,
        nodeId: node.id,
        xp: node.xp,
      });
    } else {
      await progressRepo.removeByEntity(node.id);
      await activityRepo.removeByEntity(node.id);
    }
  },
};
