import type { Curriculum } from "@/types/curriculum";

/**
 * The curriculum *structure* — semesters, modules, weeks, and lesson metadata.
 *
 * IMPORTANT: this file contains no lesson *bodies*. Each lesson references a
 * `contentPath` that resolves to a Markdown file under the repository-level
 * `content/` directory, loaded lazily by `@/content/loader`. This keeps the
 * platform content-driven: authors add Markdown, not TypeScript.
 */
export const curriculum: Curriculum = {
  semesters: [
    {
      id: "sem-1",
      slug: "foundations",
      title: "Semester 1 — Foundations",
      summary:
        "Build the mental models every bug hunter needs: how the web works, HTTP, and the attacker mindset.",
      order: 1,
      modules: [
        {
          id: "mod-web-basics",
          slug: "web-basics",
          title: "How the Web Works",
          summary:
            "HTTP, DNS, browsers, and the request lifecycle from the ground up.",
          order: 1,
          icon: "globe",
          weeks: [
            {
              id: "wk-http",
              slug: "http-foundations",
              title: "Week 1 — HTTP Foundations",
              summary: "Requests, responses, methods, headers, and status codes.",
              order: 1,
              lessons: [
                {
                  id: "les-http-anatomy",
                  slug: "anatomy-of-a-request",
                  title: "Anatomy of an HTTP Request",
                  summary:
                    "Dissect a request line-by-line and learn what each part means to an attacker.",
                  kind: "reading",
                  difficulty: "beginner",
                  estimatedMinutes: 20,
                  xp: 50,
                  tags: ["http", "fundamentals"],
                  contentPath:
                    "foundations/web-basics/http-foundations/anatomy-of-a-request.md",
                },
                {
                  id: "les-http-lab",
                  slug: "intercepting-traffic",
                  title: "Lab — Intercepting Traffic",
                  summary:
                    "Use a proxy to capture and modify live HTTP requests.",
                  kind: "lab",
                  difficulty: "beginner",
                  estimatedMinutes: 40,
                  xp: 120,
                  tags: ["http", "burp", "lab"],
                  contentPath:
                    "foundations/web-basics/http-foundations/intercepting-traffic.md",
                },
              ],
            },
          ],
        },
        {
          id: "mod-recon",
          slug: "recon",
          title: "Reconnaissance",
          summary:
            "Map the attack surface: subdomains, endpoints, and technology fingerprinting.",
          order: 2,
          icon: "radar",
          weeks: [
            {
              id: "wk-recon-1",
              slug: "attack-surface-mapping",
              title: "Week 2 — Attack Surface Mapping",
              summary: "Enumerate assets and understand scope.",
              order: 1,
              lessons: [
                {
                  id: "les-scope",
                  slug: "reading-the-scope",
                  title: "Reading a Bug Bounty Scope",
                  summary:
                    "Interpret program policy, scope, and rules of engagement.",
                  kind: "reading",
                  difficulty: "beginner",
                  estimatedMinutes: 15,
                  xp: 40,
                  tags: ["recon", "scope"],
                  contentPath:
                    "foundations/recon/attack-surface-mapping/reading-the-scope.md",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "sem-2",
      slug: "web-vulnerabilities",
      title: "Semester 2 — Web Vulnerabilities",
      summary:
        "The OWASP-driven core: injection, access control, and client-side attacks.",
      order: 2,
      modules: [
        {
          id: "mod-access-control",
          slug: "access-control",
          title: "Broken Access Control",
          summary: "IDOR, privilege escalation, and authorization flaws.",
          order: 1,
          icon: "lock",
          weeks: [
            {
              id: "wk-idor",
              slug: "idor",
              title: "Week 3 — IDOR",
              summary: "Insecure Direct Object References end-to-end.",
              order: 1,
              lessons: [
                {
                  id: "les-idor-intro",
                  slug: "understanding-idor",
                  title: "Understanding IDOR",
                  summary:
                    "How object references leak data and how to spot them.",
                  kind: "reading",
                  difficulty: "intermediate",
                  estimatedMinutes: 25,
                  xp: 80,
                  tags: ["idor", "access-control", "owasp"],
                  contentPath:
                    "web-vulnerabilities/access-control/idor/understanding-idor.md",
                },
                {
                  id: "les-idor-assignment",
                  slug: "idor-hunt-assignment",
                  title: "Assignment — Hunt an IDOR",
                  summary:
                    "Apply what you learned against a deliberately vulnerable target.",
                  kind: "assignment",
                  difficulty: "intermediate",
                  estimatedMinutes: 60,
                  xp: 200,
                  tags: ["idor", "assignment"],
                  contentPath:
                    "web-vulnerabilities/access-control/idor/idor-hunt-assignment.md",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
