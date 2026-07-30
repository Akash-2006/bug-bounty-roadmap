import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CurriculumTemplate } from "@/core/templates/catalog";
import { queryKeys } from "@/data/queries/keys";
import { templateService } from "@/data/services/template-service";

/** Create a curriculum from a template and refresh the curricula list. */
export function useCreateFromTemplate(workspaceId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (template: CurriculumTemplate) =>
      templateService.createFromTemplate(workspaceId as string, template),
    onSuccess: () => {
      if (workspaceId) {
        void qc.invalidateQueries({
          queryKey: queryKeys.curricula(workspaceId),
        });
      }
    },
  });
}
