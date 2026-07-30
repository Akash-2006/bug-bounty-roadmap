import { useMutation, useQueryClient } from "@tanstack/react-query";

import { downloadBlob, downloadText, readFileAsText } from "@/lib/download";
import {
  exportWorkspace,
  importEnvelope,
  type ImportResult,
} from "@/data/serialization/json";
import { curriculumToZip } from "@/data/serialization/markdown";

/** Export the whole workspace as a downloadable JSON file. */
export function useExportWorkspaceJson(workspaceId: string | undefined) {
  return useMutation({
    mutationFn: async () => {
      const envelope = await exportWorkspace(workspaceId as string);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadText(
        `bbu-workspace-${stamp}.json`,
        JSON.stringify(envelope, null, 2),
      );
    },
  });
}

/** Export a single curriculum as a Markdown ZIP archive. */
export function useExportCurriculumMarkdown() {
  return useMutation({
    mutationFn: async (curriculumId: string) => {
      const result = await curriculumToZip(curriculumId);
      if (result) downloadBlob(result.filename, result.blob);
    },
  });
}

/** Import a JSON export file into the active workspace. */
export function useImportJson(workspaceId: string | undefined) {
  const qc = useQueryClient();
  return useMutation<ImportResult, Error, File>({
    mutationFn: async (file: File) => {
      const text = await readFileAsText(file);
      const raw = JSON.parse(text);
      return importEnvelope(workspaceId as string, raw);
    },
    onSuccess: () => {
      // Refresh every data view after a bulk import.
      void qc.invalidateQueries();
    },
  });
}
