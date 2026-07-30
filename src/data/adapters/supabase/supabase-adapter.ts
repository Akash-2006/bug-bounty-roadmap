import { requireSupabase } from "@/lib/supabase";
import type {
  PersistenceAdapter,
  TableName,
} from "@/data/adapters/persistence-adapter";

/**
 * Supabase implementation of the persistence contract (ADR 0003). Each record
 * is stored as a single `doc` jsonb column keyed by `id`, mirroring the Dexie
 * adapter. Row-level security scopes every query to the authenticated user, and
 * a `user_id default auth.uid()` column stamps ownership on insert.
 */

// Map camelCase table names to snake_case Postgres tables.
const TABLE_MAP: Record<TableName, string> = {
  workspaces: "workspaces",
  curricula: "curricula",
  nodes: "nodes",
  edges: "edges",
  progress: "progress",
  activities: "activities",
  flashcards: "flashcards",
  quizQuestions: "quiz_questions",
  bookmarks: "bookmarks",
  notes: "notes",
  assignments: "assignments",
};

function tbl(name: TableName): string {
  return TABLE_MAP[name];
}

export class SupabaseAdapter implements PersistenceAdapter {
  async getAll<T>(table: TableName): Promise<T[]> {
    const { data, error } = await requireSupabase().from(tbl(table)).select("doc");
    if (error) throw error;
    return (data ?? []).map((r) => r.doc as T);
  }

  async get<T>(table: TableName, id: string): Promise<T | undefined> {
    const { data, error } = await requireSupabase()
      .from(tbl(table))
      .select("doc")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data?.doc as T) ?? undefined;
  }

  async where<T>(table: TableName, index: string, value: string): Promise<T[]> {
    const { data, error } = await requireSupabase()
      .from(tbl(table))
      .select("doc")
      .eq(`doc->>${index}`, value);
    if (error) throw error;
    return (data ?? []).map((r) => r.doc as T);
  }

  async put<T>(table: TableName, value: T): Promise<void> {
    const id = (value as { id: string }).id;
    const { error } = await requireSupabase()
      .from(tbl(table))
      .upsert({ id, doc: value });
    if (error) throw error;
  }

  async bulkPut<T>(table: TableName, values: T[]): Promise<void> {
    if (values.length === 0) return;
    const rows = values.map((v) => ({ id: (v as { id: string }).id, doc: v }));
    const { error } = await requireSupabase().from(tbl(table)).upsert(rows);
    if (error) throw error;
  }

  async delete(table: TableName, id: string): Promise<void> {
    const { error } = await requireSupabase()
      .from(tbl(table))
      .delete()
      .eq("id", id);
    if (error) throw error;
  }

  async bulkDelete(table: TableName, ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await requireSupabase()
      .from(tbl(table))
      .delete()
      .in("id", ids);
    if (error) throw error;
  }

  async deleteWhere(
    table: TableName,
    index: string,
    value: string,
  ): Promise<void> {
    const { error } = await requireSupabase()
      .from(tbl(table))
      .delete()
      .eq(`doc->>${index}`, value);
    if (error) throw error;
  }
}
