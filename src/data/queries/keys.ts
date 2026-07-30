/** Centralized, typed query keys for cache invalidation (ADR 0005). */
export const queryKeys = {
  workspaces: ["workspaces"] as const,
  curricula: (workspaceId: string) => ["curricula", workspaceId] as const,
  curriculum: (id: string) => ["curriculum", id] as const,
  nodes: (curriculumId: string) => ["nodes", curriculumId] as const,
};
