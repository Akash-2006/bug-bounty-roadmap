import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * Provides the TanStack Query cache (ADR 0005). Local-first data rarely goes
 * stale from under us, so we disable window-focus refetching and keep data
 * fresh for a minute by default.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
