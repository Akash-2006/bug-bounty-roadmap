import { RouterProvider } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/app/providers/query-provider";
import { useApplyTheme } from "@/hooks/use-apply-theme";
import { useInitAuth } from "@/hooks/use-init-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { AuthPage } from "@/features/auth/AuthPage";
import { useAuthStore } from "@/stores/auth-store";
import { router } from "@/app/router";

function AppContent() {
  const status = useAuthStore((s) => s.status);

  // Local mode: no auth gate — behave exactly as a local-first app.
  if (!isSupabaseConfigured) {
    return <RouterProvider router={router} />;
  }

  // Cloud mode: gate the app behind sign-in.
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (status === "signed_out") {
    return <AuthPage />;
  }
  return <RouterProvider router={router} />;
}

export function App() {
  useApplyTheme();
  useInitAuth();

  return (
    <QueryProvider>
      <TooltipProvider delayDuration={200}>
        <AppContent />
      </TooltipProvider>
    </QueryProvider>
  );
}
