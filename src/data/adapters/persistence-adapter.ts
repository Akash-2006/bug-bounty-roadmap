/**
 * The storage-agnostic persistence contract (ADR 0003). Repositories depend on
 * this interface only; concrete adapters (Dexie now, GitHub/Cloud later)
 * implement it. Kept intentionally small and table-oriented.
 */
export type TableName =
  | "workspaces"
  | "curricula"
  | "nodes"
  | "edges"
  | "progress"
  | "activities"
  | "flashcards"
  | "quizQuestions";

export interface PersistenceAdapter {
  getAll<T>(table: TableName): Promise<T[]>;
  get<T>(table: TableName, id: string): Promise<T | undefined>;
  /** Rows whose indexed field equals `value`. */
  where<T>(table: TableName, index: string, value: string): Promise<T[]>;
  put<T>(table: TableName, value: T): Promise<void>;
  bulkPut<T>(table: TableName, values: T[]): Promise<void>;
  delete(table: TableName, id: string): Promise<void>;
  bulkDelete(table: TableName, ids: string[]): Promise<void>;
  /** Delete all rows of a table whose indexed field equals `value`. */
  deleteWhere(table: TableName, index: string, value: string): Promise<void>;
}
