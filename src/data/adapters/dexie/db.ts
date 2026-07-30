import Dexie, { type Table } from "dexie";

import type { Curriculum } from "@/core/schemas/curriculum";
import type { CurriculumEdge, CurriculumNode } from "@/core/schemas/node";
import type { Activity, ProgressRecord } from "@/core/schemas/progress";
import type { Workspace } from "@/core/schemas/workspace";

/**
 * The local IndexedDB database (ADR 0002). Indexes are chosen for the tree and
 * graph access patterns. The Dexie version number tracks storage-shape
 * migrations; domain `schemaVersion` (ADR 0011) tracks record-shape migrations.
 */
export class AppDatabase extends Dexie {
  workspaces!: Table<Workspace, string>;
  curricula!: Table<Curriculum, string>;
  nodes!: Table<CurriculumNode, string>;
  edges!: Table<CurriculumEdge, string>;
  progress!: Table<ProgressRecord, string>;
  activities!: Table<Activity, string>;

  constructor() {
    super("bbu-db");
    this.version(1).stores({
      workspaces: "id, updatedAt",
      curricula: "id, workspaceId, slug, order, updatedAt",
      nodes: "id, curriculumId, parentId, [curriculumId+parentId], order, updatedAt",
      edges: "id, curriculumId, fromNodeId, toNodeId, type",
    });
    // v2: gamification — progress + append-only activity log (ADR 0010).
    this.version(2).stores({
      nodes:
        "id, curriculumId, workspaceId, parentId, [curriculumId+parentId], order, updatedAt",
      progress:
        "id, workspaceId, curriculumId, entityId, [entityType+entityId], updatedAt",
      activities: "id, workspaceId, curriculumId, entityId, type, at",
    });
  }
}

export const db = new AppDatabase();
