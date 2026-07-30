import { create } from "zustand";

export type AuthStatus = "loading" | "signed_in" | "signed_out";

interface AuthState {
  status: AuthStatus;
  email: string | null;
  userId: string | null;
  setSession: (session: { email: string | null; userId: string | null }) => void;
}

/** Holds the current Supabase auth state (only meaningful in cloud mode). */
export const useAuthStore = create<AuthState>((set) => ({
  status: "loading",
  email: null,
  userId: null,
  setSession: ({ email, userId }) =>
    set({ email, userId, status: userId ? "signed_in" : "signed_out" }),
}));
