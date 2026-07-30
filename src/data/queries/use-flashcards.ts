import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { ReviewGrade } from "@/core/srs/sm2";
import type { CreateFlashcardInput } from "@/core/schemas/flashcard";
import type { CurriculumNode } from "@/core/schemas/node";
import { flashcardService } from "@/data/services/flashcard-service";

/** Flashcards attached to a node. */
export function useFlashcards(nodeId: string | undefined) {
  return useQuery({
    queryKey: ["flashcards", "node", nodeId ?? "none"],
    queryFn: () => flashcardService.listByNode(nodeId as string),
    enabled: Boolean(nodeId),
  });
}

/** Cards due for review across the workspace. */
export function useDueFlashcards(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["flashcards", "due", workspaceId ?? "none"],
    queryFn: () => flashcardService.listDue(workspaceId as string),
    enabled: Boolean(workspaceId),
  });
}

/** Count of due cards (for the nav badge). */
export function useDueCount(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["flashcards", "due-count", workspaceId ?? "none"],
    queryFn: () => flashcardService.countDue(workspaceId as string),
    enabled: Boolean(workspaceId),
    refetchInterval: 60_000,
  });
}

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: ["flashcards"] });
}

export function useCreateFlashcard(node: CurriculumNode | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFlashcardInput) =>
      flashcardService.create(node as CurriculumNode, input),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useDeleteFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => flashcardService.remove(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useReviewFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, grade }: { id: string; grade: ReviewGrade }) =>
      flashcardService.review(id, grade),
    onSuccess: () => invalidateAll(qc),
  });
}
