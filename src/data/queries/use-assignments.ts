import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  AssignmentStatus,
  CreateAssignmentInput,
} from "@/core/schemas/assignment";
import type { CurriculumNode } from "@/core/schemas/node";
import { assignmentService } from "@/data/services/assignment-service";

export function useNodeAssignments(nodeId: string | undefined) {
  return useQuery({
    queryKey: ["assignments", "node", nodeId ?? "none"],
    queryFn: () => assignmentService.listByNode(nodeId as string),
    enabled: Boolean(nodeId),
  });
}

export function useAssignments(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["assignments", "workspace", workspaceId ?? "none"],
    queryFn: () => assignmentService.listWithContext(workspaceId as string),
    enabled: Boolean(workspaceId),
  });
}

function invalidate(
  qc: ReturnType<typeof useQueryClient>,
  node: CurriculumNode | null | undefined,
) {
  void qc.invalidateQueries({ queryKey: ["assignments"] });
  if (node) void qc.invalidateQueries({ queryKey: ["dashboard", node.workspaceId] });
}

export function useCreateAssignment(node: CurriculumNode | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssignmentInput) =>
      assignmentService.create(node as CurriculumNode, input),
    onSuccess: () => invalidate(qc, node),
  });
}

export function useSetAssignmentStatus(
  node?: CurriculumNode | null,
  workspaceId?: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AssignmentStatus }) =>
      assignmentService.setStatus(id, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["assignments"] });
      const ws = node?.workspaceId ?? workspaceId;
      if (ws) void qc.invalidateQueries({ queryKey: ["dashboard", ws] });
    },
  });
}

export function useDeleteAssignment(node?: CurriculumNode | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assignmentService.remove(id),
    onSuccess: () => invalidate(qc, node),
  });
}
