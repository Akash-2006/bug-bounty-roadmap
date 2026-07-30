import { SCHEMA_VERSION } from "@/core/constants";
import { eventBus } from "@/core/events/event-bus";
import { createId } from "@/core/ids";
import { orderAfter } from "@/core/ordering";
import type { CurriculumNode } from "@/core/schemas/node";
import {
  QUIZ_PASS_RATIO,
  XP_PER_CORRECT,
  type CreateQuizQuestionInput,
  type QuizQuestion,
} from "@/core/schemas/quiz";
import { activityRepo } from "@/data/repositories/activity-repo";
import { quizRepo } from "@/data/repositories/quiz-repo";

export interface QuizResult {
  total: number;
  correct: number;
  ratio: number;
  passed: boolean;
  xpAwarded: number;
}

/** Quiz authoring + scoring use-cases (ADR 0006). */
export const quizService = {
  listByNode: quizRepo.listByNode,

  async create(
    node: CurriculumNode,
    input: CreateQuizQuestionInput,
  ): Promise<QuizQuestion> {
    const existing = await quizRepo.listByNode(node.id);
    const now = Date.now();
    const question: QuizQuestion = {
      id: createId(),
      schemaVersion: SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      workspaceId: node.workspaceId,
      curriculumId: node.curriculumId,
      nodeId: node.id,
      prompt: input.prompt,
      options: input.options,
      answerIndex: input.answerIndex,
      explanation: input.explanation,
      order: orderAfter(existing.at(-1)?.order ?? null),
    };
    await quizRepo.save(question);
    return question;
  },

  async remove(id: string): Promise<void> {
    await quizRepo.remove(id);
  },

  /**
   * Score a completed attempt. On a pass, append a `quiz.passed` activity
   * (XP scales with correct answers) so it flows into the dashboard.
   */
  async submit(
    node: CurriculumNode,
    questions: QuizQuestion[],
    answers: Record<string, number>,
  ): Promise<QuizResult> {
    const total = questions.length;
    const correct = questions.reduce(
      (n, q) => n + (answers[q.id] === q.answerIndex ? 1 : 0),
      0,
    );
    const ratio = total > 0 ? correct / total : 0;
    const passed = ratio >= QUIZ_PASS_RATIO;
    const xpAwarded = passed ? correct * XP_PER_CORRECT : 0;

    if (passed && xpAwarded > 0) {
      const now = Date.now();
      await activityRepo.append({
        id: createId(),
        schemaVersion: SCHEMA_VERSION,
        createdAt: now,
        updatedAt: now,
        workspaceId: node.workspaceId,
        curriculumId: node.curriculumId,
        type: "quiz.passed",
        entityType: "node",
        entityId: node.id,
        xp: xpAwarded,
        at: now,
      });
      eventBus.emit("quiz.passed", {
        curriculumId: node.curriculumId,
        nodeId: node.id,
        xp: xpAwarded,
        score: Math.round(ratio * 100),
      });
    }

    return { total, correct, ratio, passed, xpAwarded };
  },
};
