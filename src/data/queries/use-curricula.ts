import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CreateCurriculumInput,
  UpdateCurriculumInput,
} from "@/core/schemas/curriculum";
import { queryKeys } from "@/data/queries/keys";
import { curriculumService } from "@/data/services/curriculum-service";

/** List curricula in a workspace. */
export function useCurricula(workspaceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.curricula(workspaceId ?? "none"),
    queryFn: () => curriculumService.list(workspaceId as string),
    enabled: Boolean(workspaceId),
  });
}

/** Fetch a single curriculum. */
export function useCurriculum(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.curriculum(id ?? "none"),
    queryFn: () => curriculumService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateCurriculum(workspaceId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCurriculumInput) =>
      curriculumService.create(workspaceId as string, input),
    onSuccess: () => {
      if (workspaceId) {
        void qc.invalidateQueries({
          queryKey: queryKeys.curricula(workspaceId),
        });
      }
    },
  });
}

export function useUpdateCurriculum(workspaceId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateCurriculumInput }) =>
      curriculumService.update(id, patch),
    onSuccess: (updated) => {
      if (workspaceId) {
        void qc.invalidateQueries({
          queryKey: queryKeys.curricula(workspaceId),
        });
      }
      if (updated) {
        void qc.invalidateQueries({
          queryKey: queryKeys.curriculum(updated.id),
        });
      }
    },
  });
}

export function useDeleteCurriculum(workspaceId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => curriculumService.remove(id),
    onSuccess: () => {
      if (workspaceId) {
        void qc.invalidateQueries({
          queryKey: queryKeys.curricula(workspaceId),
        });
      }
    },
  });
}
