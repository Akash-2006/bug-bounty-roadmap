import { SCHEMA_VERSION } from "@/core/constants";
import { eventBus } from "@/core/events/event-bus";
import { createId } from "@/core/ids";
import { orderAfter } from "@/core/ordering";
import type {
  Assignment,
  AssignmentStatus,
  CreateAssignmentInput,
} from "@/core/schemas/assignment";
import type { CurriculumNode } from "@/core/schemas/node";
import { activityRepo } from "@/data/repositories/activity-repo";
import { assignmentRepo } from "@/data/repositories/assignment-repo";
import { curriculumRepo } from "@/data/repositories/curriculum-repo";
import { nodeRepo } from "@/data/repositories/node-repo";

export interface AssignmentWithContext extends Assignment {
  nodeTitle: string;
  curriculumTitle: string;
  path: string;
}

/** Assignment/task use-cases (ADR 0006). Awards XP once when marked done. */
export const assignmentService = {
  listByNode: assignmentRepo.listByNode,

  async listWithContext(workspaceId: string): Promise<AssignmentWithContext[]> {
    const items = await assignmentRepo.listByWorkspace(workspaceId);
    const nodeCache = new Map<string, string>();
    const curCache = new Map<string, string>();
    const out: AssignmentWithContext[] = [];
    for (const a of items) {
      if (!nodeCache.has(a.nodeId)) {
        const n = await nodeRepo.get(a.nodeId);
        nodeCache.set(a.nodeId, n?.title ?? "(deleted lesson)");
      }
      if (!curCache.has(a.curriculumId)) {
        const c = await curriculumRepo.get(a.curriculumId);
        curCache.set(a.curriculumId, c?.title ?? "(deleted)");
      }
      out.push({
        ...a,
        nodeTitle: nodeCache.get(a.nodeId)!,
        curriculumTitle: curCache.get(a.curriculumId)!,
        path: `/curricula/${a.curriculumId}/n/${a.nodeId}`,
      });
    }
    return out.sort((x, y) => y.updatedAt - x.updatedAt);
  },

  async create(
    node: CurriculumNode,
    input: CreateAssignmentInput,
  ): Promise<Assignment> {
    const existing = await assignmentRepo.listByNode(node.id);
    const now = Date.now();
    const assignment: Assignment = {
      id: createId(),
      schemaVersion: SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      workspaceId: node.workspaceId,
      curriculumId: node.curriculumId,
      nodeId: node.id,
      title: input.title,
      description: input.description,
      status: "todo",
      dueAt: input.dueAt ?? null,
      xp: input.xp ?? 0,
      order: orderAfter(existing.at(-1)?.order ?? null),
    };
    await assignmentRepo.save(assignment);
    return assignment;
  },

  /** Change status; award/remove XP as the "done" state is entered/left. */
  async setStatus(
    id: string,
    status: AssignmentStatus,
  ): Promise<Assignment | undefined> {
    const existing = await assignmentRepo.get(id);
    if (!existing) return undefined;

    const wasDone = existing.status === "done";
    const isDone = status === "done";
    const updated: Assignment = {
      ...existing,
      status,
      updatedAt: Date.now(),
    };
    await assignmentRepo.save(updated);

    if (isDone && !wasDone && existing.xp > 0) {
      const now = Date.now();
      await activityRepo.append({
        id: createId(),
        schemaVersion: SCHEMA_VERSION,
        createdAt: now,
        updatedAt: now,
        workspaceId: existing.workspaceId,
        curriculumId: existing.curriculumId,
        type: "assignment.done",
        entityType: "assignment",
        entityId: existing.id,
        xp: existing.xp,
        at: now,
      });
      eventBus.emit("assignment.done", {
        curriculumId: existing.curriculumId,
        assignmentId: existing.id,
        xp: existing.xp,
      });
    } else if (wasDone && !isDone) {
      // Leaving done removes the XP grant so aggregates stay correct.
      await activityRepo.removeByEntity(existing.id);
    }
    return updated;
  },

  async remove(id: string): Promise<void> {
    await activityRepo.removeByEntity(id);
    await assignmentRepo.remove(id);
  },
};
