import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { createFuseProvider } from "@/data/search/fuse-provider";
import { buildSearchDocs } from "@/data/search/build-index";

/** Load and cache the workspace search documents. */
export function useSearchDocs(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["search-docs", workspaceId ?? "none"],
    queryFn: () => buildSearchDocs(workspaceId as string),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
}

/**
 * Build a memoized Fuse provider over the workspace docs and run `query`.
 * Recomputes the provider only when the docs change.
 */
export function useSearch(workspaceId: string | undefined, query: string) {
  const { data: docs } = useSearchDocs(workspaceId);

  const provider = useMemo(
    () => createFuseProvider(docs ?? []),
    [docs],
  );

  const results = useMemo(
    () => provider.search(query, 30),
    [provider, query],
  );

  return { results, ready: Boolean(docs) };
}
