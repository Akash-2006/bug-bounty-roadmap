import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { EdgeType } from "@/core/schemas/node";
import { edgeService } from "@/data/services/edge-service";

export function useEdges(curriculumId: string | undefined) {
  return useQuery({
    queryKey: ["edges", curriculumId ?? "none"],
    queryFn: () => edgeService.list(curriculumId as string),
    enabled: Boolean(curriculumId),
  });
}

export function useCreateEdge(
  workspaceId: string | undefined,
  curriculumId: string | undefined,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      from,
      to,
      type,
    }: {
      from: string;
      to: string;
      type: EdgeType;
    }) =>
      edgeService.create(
        workspaceId as string,
        curriculumId as string,
        from,
        to,
        type,
      ),
    onSuccess: () => {
      if (curriculumId)
        void qc.invalidateQueries({ queryKey: ["edges", curriculumId] });
    },
  });
}

export function useDeleteEdge(curriculumId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      edgeService.remove(curriculumId as string, id),
    onSuccess: () => {
      if (curriculumId)
        void qc.invalidateQueries({ queryKey: ["edges", curriculumId] });
    },
  });
}
