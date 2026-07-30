import Fuse from "fuse.js";

import type {
  SearchDoc,
  SearchProvider,
  SearchResult,
} from "@/core/search/types";

/**
 * Fuse.js implementation of the search contract (ADR 0008). Weights title
 * highest, then tags/subtitle, with light fuzziness for typo tolerance.
 */
export function createFuseProvider(docs: SearchDoc[]): SearchProvider {
  const fuse = new Fuse(docs, {
    includeScore: true,
    threshold: 0.4,
    ignoreLocation: true,
    keys: [
      { name: "title", weight: 0.6 },
      { name: "tags", weight: 0.25 },
      { name: "subtitle", weight: 0.15 },
    ],
  });

  return {
    search(query: string, limit = 20): SearchResult[] {
      const trimmed = query.trim();
      if (!trimmed) {
        // Empty query → recent-ish default: first N docs.
        return docs.slice(0, limit).map((doc) => ({ doc, score: 0 }));
      }
      return fuse
        .search(trimmed, { limit })
        .map((r) => ({ doc: r.item, score: r.score ?? 0 }));
    },
  };
}
