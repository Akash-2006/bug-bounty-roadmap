/**
 * Domain model for Bug Bounty University.
 *
 * The curriculum follows a strict hierarchy:
 *   Semester → Module → Week → Lesson
 *
 * These types describe the *structure* of the curriculum only. Lesson bodies
 * live in Markdown files under the repository `content/` directory and are
 * loaded lazily at runtime — never hardcoded into components.
 */

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type LessonKind = "reading" | "lab" | "assignment" | "checkpoint";

/** A single unit of learning, backed by a Markdown document. */
export interface Lesson {
  id: string;
  slug: string;
  title: string;
  summary: string;
  kind: LessonKind;
  difficulty: Difficulty;
  /** Estimated time to complete, in minutes. */
  estimatedMinutes: number;
  /** XP awarded on completion. */
  xp: number;
  tags: string[];
  /** Import key resolved against the content glob (e.g. content path). */
  contentPath: string;
}

/** A themed collection of lessons within a module, spanning one study week. */
export interface Week {
  id: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
  lessons: Lesson[];
}

/** A coherent topic area (e.g. "Web Fundamentals", "Access Control"). */
export interface Module {
  id: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
  icon?: string;
  weeks: Week[];
}

/** The top-level grouping of the curriculum. */
export interface Semester {
  id: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
  modules: Module[];
}

/** The fully-resolved curriculum tree. */
export interface Curriculum {
  semesters: Semester[];
}

/** Flattened lesson reference used by search, breadcrumbs, and navigation. */
export interface LessonRef {
  lesson: Lesson;
  weekId: string;
  moduleId: string;
  semesterId: string;
  path: string;
}
