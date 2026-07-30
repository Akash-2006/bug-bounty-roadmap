import { db } from "@/data/adapters/dexie/db";
import { persistence } from "@/data/adapters/dexie/dexie-adapter";
import type { TableName } from "@/data/adapters/persistence-adapter";

const TABLES: TableName[] = [
  "workspaces",
  "curricula",
  "nodes",
  "edges",
  "progress",
  "activities",
  "flashcards",
  "quizQuestions",
  "bookmarks",
  "notes",
  "assignments",
];

/**
 * Copy all records from the local IndexedDB database into the active cloud
 * adapter. Records keep their ids, so this is an idempotent upsert. Only used
 * in cloud mode, where `persistence` points at Supabase.
 */
export async function migrateLocalToCloud(): Promise<number> {
  let total = 0;
  for (const table of TABLES) {
    const rows = await db.table(table).toArray();
    if (rows.length > 0) {
      await persistence.bulkPut(table, rows);
      total += rows.length;
    }
  }
  return total;
}
