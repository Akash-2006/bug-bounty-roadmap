import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { CurriculumNode } from "@/core/schemas/node";
import { progressService } from "@/data/services/progress-service";

/** Completion status for a single node. */
export function useNodeProgress(nodeId: string | undefined) {
  return useQuery({
    queryKey: ["progress", "node", nodeId ?? "none"],
    queryFn: async () =>
      (await progressService.getByEntity(nodeId as string)) ?? null,
    enabled: Boolean(nodeId),
  });
}

/** All progress rows for a workspace (used by the tree + dashboard). */
export function useWorkspaceProgress(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["progress", "workspace", workspaceId ?? "none"],
    queryFn: () => progressService.listByWorkspace(workspaceId as string),
    enabled: Boolean(workspaceId),
  });
}

/** Toggle a node's completion, updating progress + activity log. */
export function useToggleComplete(workspaceId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      node,
      complete,
    }: {
      node: CurriculumNode;
      complete: boolean;
    }) => progressService.setComplete(node, complete),
    onSuccess: (_data, { node }) => {
      void qc.invalidateQueries({ queryKey: ["progress", "node", node.id] });
      if (workspaceId) {
        void qc.invalidateQueries({
          queryKey: ["progress", "workspace", workspaceId],
        });
        void qc.invalidateQueries({ queryKey: ["dashboard", workspaceId] });
      }
    },
  });
}
