import { curriculum } from "@/content/curriculum";
import type {
  Curriculum,
  Lesson,
  LessonRef,
  Module,
  Semester,
} from "@/types/curriculum";

/**
 * Lazy Markdown loaders keyed by path, relative to the repository `content/`
 * directory. Vite resolves this glob at build time; bodies are fetched only
 * when a lesson is actually opened.
 *
 * Example key: "../../content/foundations/web-basics/.../anatomy-of-a-request.md"
 */
const markdownModules = import.meta.glob("../../content/**/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

/** Resolve a lesson's `contentPath` to its Markdown loader key. */
function resolveKey(contentPath: string): string | undefined {
  const suffix = `content/${contentPath}`.replace(/\/+/g, "/");
  return Object.keys(markdownModules).find((key) => key.endsWith(suffix));
}

/** Fetch the raw Markdown body for a lesson. Throws if the file is missing. */
export async function loadLessonMarkdown(contentPath: string): Promise<string> {
  const key = resolveKey(contentPath);
  if (!key) {
    throw new Error(`No Markdown file found for content path: ${contentPath}`);
  }
  return markdownModules[key]();
}

/** The full curriculum tree. */
export function getCurriculum(): Curriculum {
  return curriculum;
}

/** Flatten the curriculum into ordered lesson references for search/nav. */
export function getAllLessons(): LessonRef[] {
  const refs: LessonRef[] = [];
  for (const semester of curriculum.semesters) {
    for (const mod of semester.modules) {
      for (const week of mod.weeks) {
        for (const lesson of week.lessons) {
          refs.push({
            lesson,
            weekId: week.id,
            moduleId: mod.id,
            semesterId: semester.id,
            path: `/learn/${semester.slug}/${mod.slug}/${week.slug}/${lesson.slug}`,
          });
        }
      }
    }
  }
  return refs;
}

export interface CurriculumStats {
  semesters: number;
  modules: number;
  weeks: number;
  lessons: number;
  labs: number;
  assignments: number;
  totalXp: number;
  totalMinutes: number;
}

/** Aggregate high-level statistics used by the dashboard. */
export function getCurriculumStats(): CurriculumStats {
  const lessons = getAllLessons().map((r) => r.lesson);
  return {
    semesters: curriculum.semesters.length,
    modules: curriculum.semesters.reduce(
      (acc: number, s: Semester) => acc + s.modules.length,
      0,
    ),
    weeks: curriculum.semesters.reduce(
      (acc: number, s: Semester) =>
        acc + s.modules.reduce((a: number, m: Module) => a + m.weeks.length, 0),
      0,
    ),
    lessons: lessons.length,
    labs: lessons.filter((l: Lesson) => l.kind === "lab").length,
    assignments: lessons.filter((l: Lesson) => l.kind === "assignment").length,
    totalXp: lessons.reduce((acc: number, l: Lesson) => acc + l.xp, 0),
    totalMinutes: lessons.reduce(
      (acc: number, l: Lesson) => acc + l.estimatedMinutes,
      0,
    ),
  };
}
