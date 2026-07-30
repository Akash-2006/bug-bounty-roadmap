import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { CurriculumNode } from "@/core/schemas/node";
import type { CreateQuizQuestionInput, QuizQuestion } from "@/core/schemas/quiz";
import { quizService } from "@/data/services/quiz-service";

/** Quiz questions attached to a node. */
export function useQuizQuestions(nodeId: string | undefined) {
  return useQuery({
    queryKey: ["quiz", "node", nodeId ?? "none"],
    queryFn: () => quizService.listByNode(nodeId as string),
    enabled: Boolean(nodeId),
  });
}

export function useCreateQuizQuestion(node: CurriculumNode | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateQuizQuestionInput) =>
      quizService.create(node as CurriculumNode, input),
    onSuccess: () => {
      if (node) void qc.invalidateQueries({ queryKey: ["quiz", "node", node.id] });
    },
  });
}

export function useDeleteQuizQuestion(nodeId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => quizService.remove(id),
    onSuccess: () => {
      if (nodeId) void qc.invalidateQueries({ queryKey: ["quiz", "node", nodeId] });
    },
  });
}

export function useSubmitQuiz(node: CurriculumNode | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      questions,
      answers,
    }: {
      questions: QuizQuestion[];
      answers: Record<string, number>;
    }) => quizService.submit(node as CurriculumNode, questions, answers),
    onSuccess: () => {
      // XP/dashboard may have changed on a pass.
      if (node) {
        void qc.invalidateQueries({ queryKey: ["dashboard", node.workspaceId] });
      }
    },
  });
}
