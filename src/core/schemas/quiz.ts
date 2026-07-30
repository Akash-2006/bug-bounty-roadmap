import { z } from "zod";

import { baseEntitySchema } from "@/core/schemas/base";

/** A single-answer multiple-choice question attached to a lesson node. */
export const quizQuestionSchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1),
  curriculumId: z.string().min(1),
  nodeId: z.string().min(1),
  prompt: z.string().min(1).max(1000),
  options: z.array(z.string().min(1).max(400)).min(2).max(6),
  answerIndex: z.number().int().min(0),
  explanation: z.string().max(1000).optional(),
  order: z.string().min(1),
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const createQuizQuestionSchema = z
  .object({
    prompt: z.string().min(1, "Question is required").max(1000),
    options: z.array(z.string().min(1)).min(2, "Add at least two options").max(6),
    answerIndex: z.number().int().min(0),
    explanation: z.string().max(1000).optional(),
  })
  .refine((v) => v.answerIndex < v.options.length, {
    message: "The correct answer must be one of the options",
    path: ["answerIndex"],
  });
export type CreateQuizQuestionInput = z.infer<typeof createQuizQuestionSchema>;

/** XP awarded per correct answer when a quiz is passed. */
export const XP_PER_CORRECT = 10;
/** Minimum fraction correct to count as a pass. */
export const QUIZ_PASS_RATIO = 0.7;
