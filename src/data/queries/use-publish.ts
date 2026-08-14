import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { isSupabaseConfigured } from "@/lib/supabase";
import { publishService } from "@/data/services/publish-service";
import { queryKeys } from "@/data/queries/keys";

/** All community-published curricula (cloud mode only). */
export function usePublishedCurricula() {
  return useQuery({
    queryKey: ["published"],
    queryFn: () => publishService.listAll(),
    enabled: isSupabaseConfigured,
  });
}

/** Whether the given curriculum is currently shared, and its publication. */
export function usePublicationForCurriculum(curriculumId: string | undefined) {
  return useQuery({
    queryKey: ["publication", curriculumId ?? "none"],
    queryFn: async () =>
      (await publishService.getBySource(curriculumId as string)) ?? null,
    enabled: isSupabaseConfigured && Boolean(curriculumId),
  });
}

export function usePublishCurriculum(curriculumId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => publishService.publish(curriculumId as string),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["publication", curriculumId] });
      void qc.invalidateQueries({ queryKey: ["published"] });
    },
  });
}

export function useUnpublish(curriculumId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publishService.unpublish(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["publication", curriculumId] });
      void qc.invalidateQueries({ queryKey: ["published"] });
    },
  });
}

export function useImportPublished(workspaceId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      publishService.importPublished(workspaceId as string, id),
    onSuccess: () => {
      if (workspaceId) {
        void qc.invalidateQueries({
          queryKey: queryKeys.curricula(workspaceId),
        });
      }
    },
  });
}
