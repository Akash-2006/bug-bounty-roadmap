import { useQuery } from "@tanstack/react-query";

import { achievementsService } from "@/data/services/achievements-service";

/** Derived achievement status for the active workspace. */
export function useAchievements(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["achievements", workspaceId ?? "none"],
    queryFn: () => achievementsService.getStatus(workspaceId as string),
    enabled: Boolean(workspaceId),
  });
}
