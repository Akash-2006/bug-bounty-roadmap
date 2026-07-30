/** A searchable document projected from a domain entity (ADR 0008). */
export interface SearchDoc {
  id: string;
  type: "curriculum" | "node";
  title: string;
  subtitle?: string;
  tags: string[];
  /** Router path to open this result. */
  path: string;
  /** Human label for the entity kind, e.g. "Lesson", "Module", "Curriculum". */
  kindLabel: string;
}

export interface SearchResult {
  doc: SearchDoc;
  /** 0 (best) to 1 (worst); provider-defined. */
  score: number;
}

/**
 * Storage/engine-agnostic search contract (ADR 0008). The MVP ships a
 * Fuse.js implementation; a server-backed provider can replace it later
 * without touching the UI.
 */
export interface SearchProvider {
  search(query: string, limit?: number): SearchResult[];
}
