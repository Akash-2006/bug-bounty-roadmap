import { compareOrder } from "@/core/ordering";
import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import type { QuizQuestion } from "@/core/schemas/quiz";

/** Persistence for quiz questions (ADR 0005). */
export const quizRepo = {
  async listByNode(nodeId: string): Promise<QuizQuestion[]> {
    const rows = await persistence.where<QuizQuestion>(
      "quizQuestions",
      "nodeId",
      nodeId,
    );
    return rows.sort((a, b) => compareOrder(a.order, b.order));
  },

  save(question: QuizQuestion): Promise<void> {
    return persistence.put("quizQuestions", question);
  },

  remove(id: string): Promise<void> {
    return persistence.delete("quizQuestions", id);
  },
};
