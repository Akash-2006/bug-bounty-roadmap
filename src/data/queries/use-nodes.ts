import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { CreateNodeInput, UpdateNodeInput } from "@/core/schemas/node";
import { queryKeys } from "@/data/queries/keys";
import { nodeService } from "@/data/services/node-service";

/** All nodes for a curriculum (flat; assembled into a tree in the UI). */
export function useNodes(curriculumId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.nodes(curriculumId ?? "none"),
    queryFn: () => nodeService.list(curriculumId as string),
    enabled: Boolean(curriculumId),
  });
}

export function useCreateNode(
  workspaceId: string | undefined,
  curriculumId: string | undefined,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateNodeInput) =>
      nodeService.create(workspaceId as string, curriculumId as string, input),
    onSuccess: () => invalidate(qc, curriculumId),
  });
}

export function useUpdateNode(curriculumId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateNodeInput }) =>
      nodeService.update(id, patch),
    onSuccess: () => invalidate(qc, curriculumId),
  });
}

export function useReorderNode(curriculumId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, direction }: { id: string; direction: "up" | "down" }) =>
      nodeService.reorder(id, direction),
    onSuccess: () => invalidate(qc, curriculumId),
  });
}

export function useDeleteNode(curriculumId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      nodeService.remove(curriculumId as string, id),
    onSuccess: () => invalidate(qc, curriculumId),
  });
}

function invalidate(
  qc: ReturnType<typeof useQueryClient>,
  curriculumId: string | undefined,
) {
  if (curriculumId) {
    void qc.invalidateQueries({ queryKey: queryKeys.nodes(curriculumId) });
  }
}
