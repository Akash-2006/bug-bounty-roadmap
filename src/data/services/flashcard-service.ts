import { SCHEMA_VERSION } from "@/core/constants";
import { createId } from "@/core/ids";
import { scheduleReview, type ReviewGrade } from "@/core/srs/sm2";
import type { CurriculumNode } from "@/core/schemas/node";
import type { CreateFlashcardInput, Flashcard } from "@/core/schemas/flashcard";
import { flashcardRepo } from "@/data/repositories/flashcard-repo";

/** Flashcard use-cases including SRS review scheduling (ADR 0006). */
export const flashcardService = {
  listByNode: flashcardRepo.listByNode,

  /** Cards from the workspace that are due now, soonest first. */
  async listDue(workspaceId: string): Promise<Flashcard[]> {
    const now = Date.now();
    const all = await flashcardRepo.listByWorkspace(workspaceId);
    return all
      .filter((c) => c.dueAt <= now)
      .sort((a, b) => a.dueAt - b.dueAt);
  },

  async countDue(workspaceId: string): Promise<number> {
    const now = Date.now();
    const all = await flashcardRepo.listByWorkspace(workspaceId);
    return all.filter((c) => c.dueAt <= now).length;
  },

  async create(
    node: CurriculumNode,
    input: CreateFlashcardInput,
  ): Promise<Flashcard> {
    const now = Date.now();
    const card: Flashcard = {
      id: createId(),
      schemaVersion: SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      workspaceId: node.workspaceId,
      curriculumId: node.curriculumId,
      nodeId: node.id,
      front: input.front,
      back: input.back,
      ease: 2.5,
      intervalDays: 0,
      reps: 0,
      lapses: 0,
      dueAt: now, // due immediately
    };
    await flashcardRepo.save(card);
    return card;
  },

  async remove(id: string): Promise<void> {
    await flashcardRepo.remove(id);
  },

  /** Grade a review and reschedule the card via SM-2. */
  async review(id: string, grade: ReviewGrade): Promise<Flashcard | undefined> {
    const card = await flashcardRepo.get(id);
    if (!card) return undefined;
    const next = scheduleReview(card, grade);
    const updated: Flashcard = { ...card, ...next, updatedAt: Date.now() };
    await flashcardRepo.save(updated);
    return updated;
  },
};
