import Dexie, { type Table } from "dexie";

import { SCHEMA_VERSION } from "@/core/constants";
import type { Curriculum } from "@/core/schemas/curriculum";
import type { CurriculumEdge, CurriculumNode } from "@/core/schemas/node";
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

  constructor() {
    super("bbu-db");
    this.version(SCHEMA_VERSION).stores({
      workspaces: "id, updatedAt",
      curricula: "id, workspaceId, slug, order, updatedAt",
      nodes: "id, curriculumId, parentId, [curriculumId+parentId], order, updatedAt",
      edges: "id, curriculumId, fromNodeId, toNodeId, type",
    });
  }
}

export const db = new AppDatabase();
