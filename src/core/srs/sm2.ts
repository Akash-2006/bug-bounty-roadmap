/**
 * A lightweight SM-2-style spaced-repetition scheduler. Given the current SRS
 * state of a card and the learner's recall grade, it returns the next state.
 * Intervals are in days; `dueAt` is epoch milliseconds.
 */

export type ReviewGrade = "again" | "hard" | "good" | "easy";

export interface SrsState {
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
  dueAt: number;
}

const DAY_MS = 86_400_000;
const LEARN_AGAIN_MS = 10 * 60_000; // 10 minutes

function clampEase(ease: number): number {
  return Math.min(3, Math.max(1.3, ease));
}

/** Compute the next SRS state after grading a review at time `now`. */
export function scheduleReview(
  state: SrsState,
  grade: ReviewGrade,
  now: number = Date.now(),
): SrsState {
  let { ease, intervalDays, reps, lapses } = state;

  if (grade === "again") {
    return {
      ease: clampEase(ease - 0.2),
      intervalDays: 0,
      reps: 0,
      lapses: lapses + 1,
      dueAt: now + LEARN_AGAIN_MS,
    };
  }

  reps += 1;
  ease = clampEase(
    ease + (grade === "hard" ? -0.15 : grade === "easy" ? 0.15 : 0),
  );

  if (reps === 1) {
    intervalDays = grade === "easy" ? 2 : 1;
  } else if (reps === 2) {
    intervalDays = grade === "hard" ? 3 : grade === "easy" ? 6 : 4;
  } else {
    const factor = grade === "hard" ? 0.8 : grade === "easy" ? 1.3 : 1;
    intervalDays = Math.max(1, Math.round(intervalDays * ease * factor));
  }

  return { ease, intervalDays, reps, lapses, dueAt: now + intervalDays * DAY_MS };
}

/** Human-friendly "next due" preview for a grade, e.g. "4d" or "10m". */
export function previewInterval(
  state: SrsState,
  grade: ReviewGrade,
  now: number = Date.now(),
): string {
  const next = scheduleReview(state, grade, now);
  const ms = next.dueAt - now;
  if (ms < DAY_MS) return `${Math.round(ms / 60_000)}m`;
  return `${Math.round(ms / DAY_MS)}d`;
}
