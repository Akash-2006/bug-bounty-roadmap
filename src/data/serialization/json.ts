import { SCHEMA_VERSION } from "@/core/constants";
import { createId } from "@/core/ids";
import { orderAfter } from "@/core/ordering";
import type { Curriculum } from "@/core/schemas/curriculum";
import type { CurriculumNode } from "@/core/schemas/node";
import {
  exportEnvelopeSchema,
  type ExportEnvelope,
} from "@/core/schemas/export";
import type { Activity, ProgressRecord } from "@/core/schemas/progress";
import { activityRepo } from "@/data/repositories/activity-repo";
import { curriculumRepo } from "@/data/repositories/curriculum-repo";
import { nodeRepo } from "@/data/repositories/node-repo";
import { progressRepo } from "@/data/repositories/progress-repo";

function envelope(
  scope: "workspace" | "curriculum",
  curricula: Curriculum[],
  nodes: CurriculumNode[],
  progress: ProgressRecord[],
  activities: Activity[],
): ExportEnvelope {
  return {
    format: "bbu-export",
    schemaVersion: SCHEMA_VERSION,
    exportedAt: Date.now(),
    scope,
    curricula,
    nodes,
    progress,
    activities,
  };
}

/** Serialize the whole workspace into a portable envelope. */
export async function exportWorkspace(
  workspaceId: string,
): Promise<ExportEnvelope> {
  const curricula = await curriculumRepo.listByWorkspace(workspaceId);
  const nodeLists = await Promise.all(
    curricula.map((c) => nodeRepo.listByCurriculum(c.id)),
  );
  const nodes = nodeLists.flat();
  const [progress, activities] = await Promise.all([
    progressRepo.listByWorkspace(workspaceId),
    activityRepo.listByWorkspace(workspaceId),
  ]);
  return envelope("workspace", curricula, nodes, progress, activities);
}

/** Serialize a single curriculum (structure + content). */
export async function exportCurriculum(
  curriculumId: string,
): Promise<ExportEnvelope | null> {
  const curriculum = await curriculumRepo.get(curriculumId);
  if (!curriculum) return null;
  const nodes = await nodeRepo.listByCurriculum(curriculumId);
  return envelope("curriculum", [curriculum], nodes, [], []);
}

export interface ImportResult {
  curricula: number;
  nodes: number;
}

/**
 * Validate and import an envelope into the target workspace. All IDs are
 * remapped to fresh ones so imports never clobber existing data (ADR 0011).
 */
export async function importEnvelope(
  workspaceId: string,
  raw: unknown,
): Promise<ImportResult> {
  const parsed = exportEnvelopeSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("This file is not a valid Bug Bounty University export.");
  }
  const data = parsed.data;

  const curIdMap = new Map<string, string>();
  const nodeIdMap = new Map<string, string>();
  for (const c of data.curricula) curIdMap.set(c.id, createId());
  for (const n of data.nodes) nodeIdMap.set(n.id, createId());

  // Append imported curricula after existing ones.
  const existing = await curriculumRepo.listByWorkspace(workspaceId);
  let lastOrder = existing.at(-1)?.order ?? null;

  for (const c of data.curricula) {
    lastOrder = orderAfter(lastOrder);
    await curriculumRepo.save({
      ...c,
      id: curIdMap.get(c.id)!,
      workspaceId,
      order: lastOrder,
    });
  }

  const remappedNodes: CurriculumNode[] = data.nodes.map((n) => ({
    ...n,
    id: nodeIdMap.get(n.id)!,
    workspaceId,
    curriculumId: curIdMap.get(n.curriculumId) ?? n.curriculumId,
    parentId: n.parentId ? (nodeIdMap.get(n.parentId) ?? null) : null,
  }));
  if (remappedNodes.length) await nodeRepo.saveMany(remappedNodes);

  // Progress + activities are optional; remap references where possible.
  for (const p of data.progress) {
    const entityId = nodeIdMap.get(p.entityId);
    if (!entityId) continue;
    await progressRepo.save({
      ...p,
      id: createId(),
      workspaceId,
      curriculumId: curIdMap.get(p.curriculumId) ?? p.curriculumId,
      entityId,
    });
  }
  for (const a of data.activities) {
    await activityRepo.append({
      ...a,
      id: createId(),
      workspaceId,
      curriculumId: a.curriculumId
        ? (curIdMap.get(a.curriculumId) ?? a.curriculumId)
        : undefined,
      entityId: a.entityId ? nodeIdMap.get(a.entityId) : undefined,
    });
  }

  return { curricula: data.curricula.length, nodes: data.nodes.length };
}
