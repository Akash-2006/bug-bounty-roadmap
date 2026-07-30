import { useEffect } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Subscribes to Supabase auth state (cloud mode only). In local mode this is a
 * no-op and the app renders without an auth gate.
 */
export function useInitAuth() {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      setSession({
        email: data.session?.user.email ?? null,
        userId: data.session?.user.id ?? null,
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession({
        email: session?.user.email ?? null,
        userId: session?.user.id ?? null,
      });
    });

    return () => sub.subscription.unsubscribe();
  }, [setSession]);
}
