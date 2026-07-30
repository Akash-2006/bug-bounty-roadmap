import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { queryKeys } from "@/data/queries/keys";
import { workspaceService } from "@/data/services/workspace-service";
import { useWorkspaceStore } from "@/stores/workspace-store";

/**
 * Ensures a default workspace exists on first launch and selects it. Returns
 * loading state so the shell can gate rendering until a workspace is active.
 */
export function useBootstrap() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);

  const { data: workspace, isLoading } = useQuery({
    queryKey: [...queryKeys.workspaces, "ensure-default"],
    queryFn: () => workspaceService.ensureDefault(),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (workspace && workspace.id !== activeWorkspaceId) {
      setActiveWorkspace(workspace.id);
    }
  }, [workspace, activeWorkspaceId, setActiveWorkspace]);

  return {
    ready: Boolean(activeWorkspaceId ?? workspace?.id),
    isLoading,
    workspaceId: activeWorkspaceId ?? workspace?.id ?? null,
  };
}
