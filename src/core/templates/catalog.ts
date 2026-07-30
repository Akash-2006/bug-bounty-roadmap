/**
 * Curriculum templates: starter structures per subject. Each template names a
 * hierarchy scheme and a seed tree of nodes so a learner can begin instantly.
 * Templates are data, not code — new ones are added here.
 */

export interface TemplateNode {
  title: string;
  levelKey: string;
  children?: TemplateNode[];
}

export interface CurriculumTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Semantic icon key, mapped to a component in the UI. */
  icon: string;
  schemeKey: string;
  summary: string;
  nodes: TemplateNode[];
}

export const TEMPLATES: CurriculumTemplate[] = [
  {
    id: "software-engineering",
    name: "Software Engineering",
    category: "Programming",
    description: "Foundations, data structures, and systems.",
    icon: "code",
    schemeKey: "academic",
    summary: "A structured path through core software engineering.",
    nodes: [
      {
        title: "Semester 1 — Foundations",
        levelKey: "semester",
        children: [
          {
            title: "Programming Basics",
            levelKey: "module",
            children: [
              {
                title: "Week 1 — Syntax & Types",
                levelKey: "week",
                children: [
                  { title: "Variables & Types", levelKey: "lesson" },
                  { title: "Control Flow", levelKey: "lesson" },
                ],
              },
            ],
          },
          {
            title: "Data Structures",
            levelKey: "module",
            children: [
              {
                title: "Week 2 — Linear Structures",
                levelKey: "week",
                children: [
                  { title: "Arrays & Lists", levelKey: "lesson" },
                  { title: "Stacks & Queues", levelKey: "lesson" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "web-security",
    name: "Web Security",
    category: "Cyber Security",
    description: "Recon, web vulnerabilities, and exploitation.",
    icon: "shield",
    schemeKey: "academic",
    summary: "From HTTP fundamentals to advanced web exploitation.",
    nodes: [
      {
        title: "Semester 1 — Foundations",
        levelKey: "semester",
        children: [
          {
            title: "How the Web Works",
            levelKey: "module",
            children: [
              {
                title: "Week 1 — HTTP",
                levelKey: "week",
                children: [
                  { title: "Anatomy of a Request", levelKey: "lesson" },
                  { title: "Intercepting Traffic", levelKey: "lesson" },
                ],
              },
            ],
          },
          {
            title: "Reconnaissance",
            levelKey: "module",
            children: [
              {
                title: "Week 2 — Mapping",
                levelKey: "week",
                children: [{ title: "Reading the Scope", levelKey: "lesson" }],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "language-learning",
    name: "Language Learning",
    category: "Languages",
    description: "Vocabulary, grammar, and conversation.",
    icon: "languages",
    schemeKey: "book",
    summary: "Build fluency one chapter at a time.",
    nodes: [
      {
        title: "Chapter 1 — Basics",
        levelKey: "chapter",
        children: [
          { title: "Greetings", levelKey: "topic" },
          { title: "Numbers", levelKey: "topic" },
          { title: "Common Phrases", levelKey: "topic" },
        ],
      },
      {
        title: "Chapter 2 — Grammar",
        levelKey: "chapter",
        children: [
          { title: "Nouns & Articles", levelKey: "topic" },
          { title: "Present Tense", levelKey: "topic" },
        ],
      },
    ],
  },
  {
    id: "fitness",
    name: "Fitness Plan",
    category: "Health",
    description: "Progressive training modules.",
    icon: "dumbbell",
    schemeKey: "bootcamp",
    summary: "A structured plan to build strength and habit.",
    nodes: [
      {
        title: "Foundations",
        levelKey: "module",
        children: [
          { title: "Mobility & Warm-up", levelKey: "lesson" },
          { title: "Bodyweight Basics", levelKey: "lesson" },
        ],
      },
      {
        title: "Strength",
        levelKey: "module",
        children: [
          { title: "Push", levelKey: "lesson" },
          { title: "Pull", levelKey: "lesson" },
          { title: "Legs", levelKey: "lesson" },
        ],
      },
    ],
  },
  {
    id: "music-theory",
    name: "Music Theory",
    category: "Music",
    description: "Notes, scales, and harmony.",
    icon: "music",
    schemeKey: "book",
    summary: "Understand the language of music.",
    nodes: [
      {
        title: "Chapter 1 — Fundamentals",
        levelKey: "chapter",
        children: [
          { title: "Notes & the Staff", levelKey: "topic" },
          { title: "Rhythm & Meter", levelKey: "topic" },
        ],
      },
      {
        title: "Chapter 2 — Scales",
        levelKey: "chapter",
        children: [
          { title: "Major Scale", levelKey: "topic" },
          { title: "Minor Scales", levelKey: "topic" },
        ],
      },
    ],
  },
  {
    id: "blank-flat",
    name: "Simple List",
    category: "General",
    description: "A flat list of lessons — start from scratch.",
    icon: "list",
    schemeKey: "flat",
    summary: "",
    nodes: [{ title: "Lesson 1", levelKey: "lesson" }],
  },
];
