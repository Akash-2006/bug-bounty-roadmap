import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import type { Bookmark, Note } from "@/core/schemas/annotations";

/** Persistence for bookmarks (one per node). */
export const bookmarkRepo = {
  async getByNode(nodeId: string): Promise<Bookmark | undefined> {
    const rows = await persistence.where<Bookmark>(
      "bookmarks",
      "nodeId",
      nodeId,
    );
    return rows[0];
  },
  listByWorkspace(workspaceId: string): Promise<Bookmark[]> {
    return persistence.where<Bookmark>("bookmarks", "workspaceId", workspaceId);
  },
  save(b: Bookmark): Promise<void> {
    return persistence.put("bookmarks", b);
  },
  remove(id: string): Promise<void> {
    return persistence.delete("bookmarks", id);
  },
};

/** Persistence for personal notes (one per node). */
export const noteRepo = {
  async getByNode(nodeId: string): Promise<Note | undefined> {
    const rows = await persistence.where<Note>("notes", "nodeId", nodeId);
    return rows[0];
  },
  listByWorkspace(workspaceId: string): Promise<Note[]> {
    return persistence.where<Note>("notes", "workspaceId", workspaceId);
  },
  save(n: Note): Promise<void> {
    return persistence.put("notes", n);
  },
  remove(id: string): Promise<void> {
    return persistence.delete("notes", id);
  },
};
