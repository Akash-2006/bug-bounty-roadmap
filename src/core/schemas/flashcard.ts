import { z } from "zod";

import { baseEntitySchema } from "@/core/schemas/base";

/**
 * A flashcard with embedded spaced-repetition state (SM-2 lite). New cards are
 * due immediately (`dueAt` defaults to creation time).
 */
export const flashcardSchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1),
  curriculumId: z.string().min(1),
  nodeId: z.string().min(1),
  front: z.string().min(1).max(2000),
  back: z.string().min(1).max(4000),
  // SRS state
  ease: z.number().min(1.3).max(3).default(2.5),
  intervalDays: z.number().min(0).default(0),
  reps: z.number().int().min(0).default(0),
  lapses: z.number().int().min(0).default(0),
  dueAt: z.number().int().nonnegative(),
});

export type Flashcard = z.infer<typeof flashcardSchema>;

export const createFlashcardSchema = z.object({
  front: z.string().min(1, "Front is required").max(2000),
  back: z.string().min(1, "Back is required").max(4000),
});
export type CreateFlashcardInput = z.infer<typeof createFlashcardSchema>;
