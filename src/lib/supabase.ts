import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Whether Supabase env vars are present (enables cloud mode + auth). */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * The Supabase client, or null when the app runs in local-only mode.
 * Secrets come from env (`.env`), never hardcoded (the anon key is safe to
 * expose in the client because row-level security enforces per-user access).
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

/** Get the client or throw — use only in code paths gated by cloud mode. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }
  return supabase;
}
