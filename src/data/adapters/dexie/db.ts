import Dexie, { type Table } from "dexie";

import type { Curriculum } from "@/core/schemas/curriculum";
import type { Assignment } from "@/core/schemas/assignment";
import type { Bookmark, Note } from "@/core/schemas/annotations";
import type { Flashcard } from "@/core/schemas/flashcard";
import type { CurriculumEdge, CurriculumNode } from "@/core/schemas/node";
import type { Activity, ProgressRecord } from "@/core/schemas/progress";
import type { QuizQuestion } from "@/core/schemas/quiz";
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
  flashcards!: Table<Flashcard, string>;
  quizQuestions!: Table<QuizQuestion, string>;
  bookmarks!: Table<Bookmark, string>;
  notes!: Table<Note, string>;
  assignments!: Table<Assignment, string>;

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
    // v3: flashcards with spaced-repetition scheduling.
    this.version(3).stores({
      flashcards: "id, workspaceId, curriculumId, nodeId, dueAt, updatedAt",
    });
    // v4: multiple-choice quiz questions.
    this.version(4).stores({
      quizQuestions:
        "id, workspaceId, curriculumId, nodeId, order, updatedAt",
    });
    // v5: bookmarks + personal notes.
    this.version(5).stores({
      bookmarks: "id, workspaceId, curriculumId, nodeId, updatedAt",
      notes: "id, workspaceId, curriculumId, nodeId, updatedAt",
    });
    // v6: assignments / task tracker.
    this.version(6).stores({
      assignments:
        "id, workspaceId, curriculumId, nodeId, status, order, updatedAt",
    });
  }
}

export const db = new AppDatabase();
