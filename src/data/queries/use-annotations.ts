import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { CurriculumNode } from "@/core/schemas/node";
import { annotationService } from "@/data/services/annotation-service";

/* ----------------------------- Bookmarks ----------------------------- */

export function useNodeBookmark(nodeId: string | undefined) {
  return useQuery({
    queryKey: ["bookmark", "node", nodeId ?? "none"],
    queryFn: async () =>
      (await annotationService.bookmarks.getByNode(nodeId as string)) ?? null,
    enabled: Boolean(nodeId),
  });
}

export function useBookmarks(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["bookmarks", workspaceId ?? "none"],
    queryFn: () =>
      annotationService.bookmarks.listWithContext(workspaceId as string),
    enabled: Boolean(workspaceId),
  });
}

export function useToggleBookmark(node: CurriculumNode | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => annotationService.bookmarks.toggle(node as CurriculumNode),
    onSuccess: () => {
      if (node) {
        void qc.invalidateQueries({ queryKey: ["bookmark", "node", node.id] });
        void qc.invalidateQueries({ queryKey: ["bookmarks", node.workspaceId] });
      }
    },
  });
}

/* ------------------------------- Notes ------------------------------- */

export function useNodeNote(nodeId: string | undefined) {
  return useQuery({
    queryKey: ["note", "node", nodeId ?? "none"],
    queryFn: async () =>
      (await annotationService.notes.getByNode(nodeId as string)) ?? null,
    enabled: Boolean(nodeId),
  });
}

export function useNotes(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["notes", workspaceId ?? "none"],
    queryFn: () =>
      annotationService.notes.listWithContext(workspaceId as string),
    enabled: Boolean(workspaceId),
  });
}

export function useSaveNote(node: CurriculumNode | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) =>
      annotationService.notes.save(node as CurriculumNode, body),
    onSuccess: () => {
      if (node) {
        void qc.invalidateQueries({ queryKey: ["note", "node", node.id] });
        void qc.invalidateQueries({ queryKey: ["notes", node.workspaceId] });
      }
    },
  });
}
