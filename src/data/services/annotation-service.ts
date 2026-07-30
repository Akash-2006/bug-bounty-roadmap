import { SCHEMA_VERSION } from "@/core/constants";
import { createId } from "@/core/ids";
import type { Bookmark, Note } from "@/core/schemas/annotations";
import type { CurriculumNode } from "@/core/schemas/node";
import { bookmarkRepo, noteRepo } from "@/data/repositories/annotation-repo";
import { curriculumRepo } from "@/data/repositories/curriculum-repo";
import { nodeRepo } from "@/data/repositories/node-repo";

export interface AnnotationContext {
  id: string;
  nodeId: string;
  curriculumId: string;
  title: string;
  curriculumTitle: string;
  path: string;
  at: number;
  /** Present for notes only. */
  body?: string;
}

/** Resolve node + curriculum titles for a set of annotations. */
async function withContext(
  items: { id: string; nodeId: string; curriculumId: string; updatedAt: number; body?: string }[],
): Promise<AnnotationContext[]> {
  const nodeCache = new Map<string, string>();
  const curCache = new Map<string, string>();
  const out: AnnotationContext[] = [];

  for (const item of items) {
    if (!nodeCache.has(item.nodeId)) {
      const n = await nodeRepo.get(item.nodeId);
      nodeCache.set(item.nodeId, n?.title ?? "(deleted lesson)");
    }
    if (!curCache.has(item.curriculumId)) {
      const c = await curriculumRepo.get(item.curriculumId);
      curCache.set(item.curriculumId, c?.title ?? "(deleted)");
    }
    out.push({
      id: item.id,
      nodeId: item.nodeId,
      curriculumId: item.curriculumId,
      title: nodeCache.get(item.nodeId)!,
      curriculumTitle: curCache.get(item.curriculumId)!,
      path: `/curricula/${item.curriculumId}/n/${item.nodeId}`,
      at: item.updatedAt,
      body: item.body,
    });
  }
  return out.sort((a, b) => b.at - a.at);
}

/** Bookmark + note use-cases (ADR 0006). */
export const annotationService = {
  bookmarks: {
    getByNode: bookmarkRepo.getByNode,
    listByWorkspace: bookmarkRepo.listByWorkspace,

    async listWithContext(workspaceId: string): Promise<AnnotationContext[]> {
      const items = await bookmarkRepo.listByWorkspace(workspaceId);
      return withContext(items);
    },

    /** Toggle a bookmark for a node; returns the new bookmarked state. */
    async toggle(node: CurriculumNode): Promise<boolean> {
      const existing = await bookmarkRepo.getByNode(node.id);
      if (existing) {
        await bookmarkRepo.remove(existing.id);
        return false;
      }
      const now = Date.now();
      const bookmark: Bookmark = {
        id: createId(),
        schemaVersion: SCHEMA_VERSION,
        createdAt: now,
        updatedAt: now,
        workspaceId: node.workspaceId,
        curriculumId: node.curriculumId,
        nodeId: node.id,
      };
      await bookmarkRepo.save(bookmark);
      return true;
    },
  },

  notes: {
    getByNode: noteRepo.getByNode,
    listByWorkspace: noteRepo.listByWorkspace,

    async listWithContext(workspaceId: string): Promise<AnnotationContext[]> {
      const items = await noteRepo.listByWorkspace(workspaceId);
      return withContext(items);
    },

    /** Upsert the note body for a node; deletes the note when emptied. */
    async save(node: CurriculumNode, body: string): Promise<Note | null> {
      const existing = await noteRepo.getByNode(node.id);
      const trimmed = body;
      if (!trimmed.trim()) {
        if (existing) await noteRepo.remove(existing.id);
        return null;
      }
      const now = Date.now();
      const note: Note = {
        id: existing?.id ?? createId(),
        schemaVersion: SCHEMA_VERSION,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        workspaceId: node.workspaceId,
        curriculumId: node.curriculumId,
        nodeId: node.id,
        body: trimmed,
      };
      await noteRepo.save(note);
      return note;
    },
  },
};
