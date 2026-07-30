import { useState } from "react";
import { Loader2, ShieldHalf } from "lucide-react";

import { requireSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "sign_in" | "sign_up";

/** Email + password auth screen shown when cloud mode is enabled but signed out. */
export function AuthPage() {
  const [mode, setMode] = useState<Mode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const auth = requireSupabase().auth;
      if (mode === "sign_in") {
        const { error } = await auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setNotice(
            "Account created. Check your email to confirm, then sign in.",
          );
          setMode("sign_in");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShieldHalf className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Bug Bounty University
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "sign_in"
                ? "Sign in to your account"
                : "Create your account"}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={
                    mode === "sign_in" ? "current-password" : "new-password"
                  }
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              {notice && (
                <p className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
                  {notice}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="animate-spin" />}
                {mode === "sign_in" ? "Sign in" : "Create account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "sign_in" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => {
              setMode(mode === "sign_in" ? "sign_up" : "sign_in");
              setError(null);
              setNotice(null);
            }}
          >
            {mode === "sign_in" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
