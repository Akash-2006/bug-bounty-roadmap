import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import type { Flashcard } from "@/core/schemas/flashcard";

/** Persistence for flashcards (ADR 0005). */
export const flashcardRepo = {
  listByNode(nodeId: string): Promise<Flashcard[]> {
    return persistence.where<Flashcard>("flashcards", "nodeId", nodeId);
  },

  listByWorkspace(workspaceId: string): Promise<Flashcard[]> {
    return persistence.where<Flashcard>(
      "flashcards",
      "workspaceId",
      workspaceId,
    );
  },

  get(id: string): Promise<Flashcard | undefined> {
    return persistence.get<Flashcard>("flashcards", id);
  },

  save(card: Flashcard): Promise<void> {
    return persistence.put("flashcards", card);
  },

  remove(id: string): Promise<void> {
    return persistence.delete("flashcards", id);
  },
};
