import { db } from "@/data/adapters/dexie/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { SupabaseAdapter } from "@/data/adapters/supabase/supabase-adapter";
import type {
  PersistenceAdapter,
  TableName,
} from "@/data/adapters/persistence-adapter";

/**
 * Dexie-backed implementation of the persistence contract (ADR 0003). This is
 * the only place that knows about IndexedDB; everything above depends on the
 * `PersistenceAdapter` interface.
 */
export class DexieAdapter implements PersistenceAdapter {
  private table(name: TableName) {
    return db.table(name);
  }

  getAll<T>(table: TableName): Promise<T[]> {
    return this.table(table).toArray() as Promise<T[]>;
  }

  get<T>(table: TableName, id: string): Promise<T | undefined> {
    return this.table(table).get(id) as Promise<T | undefined>;
  }

  where<T>(table: TableName, index: string, value: string): Promise<T[]> {
    return this.table(table).where(index).equals(value).toArray() as Promise<
      T[]
    >;
  }

  async put<T>(table: TableName, value: T): Promise<void> {
    await this.table(table).put(value);
  }

  async bulkPut<T>(table: TableName, values: T[]): Promise<void> {
    await this.table(table).bulkPut(values);
  }

  async delete(table: TableName, id: string): Promise<void> {
    await this.table(table).delete(id);
  }

  async bulkDelete(table: TableName, ids: string[]): Promise<void> {
    await this.table(table).bulkDelete(ids);
  }

  async deleteWhere(
    table: TableName,
    index: string,
    value: string,
  ): Promise<void> {
    await this.table(table).where(index).equals(value).delete();
  }
}

/**
 * The active persistence adapter. Cloud-first: when Supabase is configured the
 * app uses it (auth gates access so queries only run when signed in);
 * otherwise it runs fully local on IndexedDB (ADR 0002/0003).
 */
export const persistence: PersistenceAdapter = isSupabaseConfigured
  ? new SupabaseAdapter()
  : new DexieAdapter();
