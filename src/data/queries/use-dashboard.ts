import { useQuery } from "@tanstack/react-query";

import { statsService } from "@/data/services/stats-service";

/** Aggregated dashboard data for the active workspace. */
export function useDashboard(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", workspaceId ?? "none"],
    queryFn: () => statsService.getDashboard(workspaceId as string),
    enabled: Boolean(workspaceId),
  });
}
