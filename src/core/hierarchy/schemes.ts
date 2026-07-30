import type { HierarchyScheme } from "@/core/schemas/hierarchy";

/**
 * Built-in hierarchy schemes users can start from. The hierarchy is data, not
 * code (ADR 0004), so these are just presets — users can define their own.
 */
export const BUILTIN_SCHEMES: HierarchyScheme[] = [
  {
    key: "academic",
    name: "Academic (Semester → Module → Week → Lesson)",
    levels: [
      { key: "semester", singular: "Semester", plural: "Semesters" },
      { key: "module", singular: "Module", plural: "Modules" },
      { key: "week", singular: "Week", plural: "Weeks" },
      { key: "lesson", singular: "Lesson", plural: "Lessons" },
    ],
  },
  {
    key: "bootcamp",
    name: "Bootcamp (Module → Lesson)",
    levels: [
      { key: "module", singular: "Module", plural: "Modules" },
      { key: "lesson", singular: "Lesson", plural: "Lessons" },
    ],
  },
  {
    key: "book",
    name: "Book (Chapter → Topic)",
    levels: [
      { key: "chapter", singular: "Chapter", plural: "Chapters" },
      { key: "topic", singular: "Topic", plural: "Topics" },
    ],
  },
  {
    key: "flat",
    name: "Flat (Lessons only)",
    levels: [{ key: "lesson", singular: "Lesson", plural: "Lessons" }],
  },
];

export function getSchemeByKey(key: string): HierarchyScheme | undefined {
  return BUILTIN_SCHEMES.find((s) => s.key === key);
}

export const DEFAULT_SCHEME_KEY = "academic";
