/**
 * Core content-hierarchy types: Semester -> Module -> Week -> Lesson.
 * These describe the shape the content engine will eventually derive
 * from the Markdown manifest (Phase 2+). Phase 1 uses mock data that
 * conforms to this same shape so nothing has to change later.
 */

export type Severity = "critical" | "high" | "medium" | "low" | "info"

export type LessonStatus = "not-started" | "in-progress" | "completed"

export interface LessonSummary {
  id: string
  slug: string
  title: string
  status: LessonStatus
  /** Difficulty/severity language reused from bug-bounty triage. */
  severity: Severity
  estimatedMinutes: number
  xp: number
}

export interface WeekSummary {
  id: string
  slug: string
  title: string
  lessons: LessonSummary[]
}

export interface ModuleSummary {
  id: string
  slug: string
  title: string
  description: string
  weeks: WeekSummary[]
}

export interface SemesterSummary {
  id: string
  slug: string
  title: string
  modules: ModuleSummary[]
}

export interface CurriculumStats {
  totalLessons: number
  completedLessons: number
  inProgressLessons: number
  totalXp: number
  earnedXp: number
  currentStreakDays: number
  labsCompleted: number
  labsTotal: number
  assignmentsCompleted: number
  assignmentsTotal: number
}
