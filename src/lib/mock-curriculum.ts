/**
 * Placeholder curriculum data, shaped exactly like the manifest the
 * content engine will generate from the content directory's Markdown
 * files in a later phase. Keeping the shape identical means swapping
 * this out is a one-line change in the data layer, not a UI rewrite.
 */
import type { SemesterSummary, CurriculumStats } from "@/types/curriculum"

export const mockCurriculum: SemesterSummary[] = [
  {
    id: "sem-1",
    slug: "web-fundamentals",
    title: "Semester 1 — Web Fundamentals",
    modules: [
      {
        id: "mod-1-1",
        slug: "http-and-recon",
        title: "HTTP & Reconnaissance",
        description:
          "Requests, responses, headers, and mapping an attack surface before touching a payload.",
        weeks: [
          {
            id: "w-1",
            slug: "week-1",
            title: "Week 1 — How the Web Actually Works",
            lessons: [
              {
                id: "l-1",
                slug: "http-lifecycle",
                title: "The HTTP request lifecycle",
                status: "completed",
                severity: "info",
                estimatedMinutes: 25,
                xp: 50,
              },
              {
                id: "l-2",
                slug: "burp-suite-setup",
                title: "Setting up Burp Suite",
                status: "completed",
                severity: "info",
                estimatedMinutes: 30,
                xp: 50,
              },
            ],
          },
          {
            id: "w-2",
            slug: "week-2",
            title: "Week 2 — Passive & Active Recon",
            lessons: [
              {
                id: "l-3",
                slug: "subdomain-enumeration",
                title: "Subdomain enumeration",
                status: "in-progress",
                severity: "low",
                estimatedMinutes: 40,
                xp: 75,
              },
              {
                id: "l-4",
                slug: "content-discovery",
                title: "Content discovery & wordlists",
                status: "not-started",
                severity: "low",
                estimatedMinutes: 35,
                xp: 75,
              },
            ],
          },
        ],
      },
      {
        id: "mod-1-2",
        slug: "injection-basics",
        title: "Injection Fundamentals",
        description: "SQL injection, command injection, and template injection basics.",
        weeks: [
          {
            id: "w-3",
            slug: "week-3",
            title: "Week 3 — SQL Injection",
            lessons: [
              {
                id: "l-5",
                slug: "sqli-union-based",
                title: "Union-based SQL injection",
                status: "not-started",
                severity: "high",
                estimatedMinutes: 45,
                xp: 100,
              },
              {
                id: "l-6",
                slug: "sqli-blind",
                title: "Blind & time-based SQL injection",
                status: "not-started",
                severity: "high",
                estimatedMinutes: 50,
                xp: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sem-2",
    slug: "advanced-exploitation",
    title: "Semester 2 — Advanced Exploitation",
    modules: [
      {
        id: "mod-2-1",
        slug: "access-control",
        title: "Access Control Flaws",
        description: "IDOR, privilege escalation, and broken auth flows.",
        weeks: [
          {
            id: "w-4",
            slug: "week-4",
            title: "Week 4 — IDOR & Privilege Escalation",
            lessons: [
              {
                id: "l-7",
                slug: "idor-basics",
                title: "Insecure direct object references",
                status: "not-started",
                severity: "critical",
                estimatedMinutes: 40,
                xp: 100,
              },
            ],
          },
        ],
      },
      {
        id: "mod-2-2",
        slug: "ssrf-and-request-smuggling",
        title: "SSRF & Request Smuggling",
        description: "Server-side request forgery and HTTP desync attacks.",
        weeks: [
          {
            id: "w-5",
            slug: "week-5",
            title: "Week 5 — SSRF",
            lessons: [
              {
                id: "l-8",
                slug: "ssrf-cloud-metadata",
                title: "SSRF against cloud metadata endpoints",
                status: "not-started",
                severity: "critical",
                estimatedMinutes: 45,
                xp: 125,
              },
            ],
          },
        ],
      },
    ],
  },
]

export const mockStats: CurriculumStats = {
  totalLessons: 8,
  completedLessons: 2,
  inProgressLessons: 1,
  totalXp: 675,
  earnedXp: 100,
  currentStreakDays: 4,
  labsCompleted: 3,
  labsTotal: 12,
  assignmentsCompleted: 1,
  assignmentsTotal: 6,
}
