import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Crown,
  Flame,
  Footprints,
  GraduationCap,
  Library,
  Lock,
  Medal,
  Rocket,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import type { AchievementTier } from "@/core/achievements/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAchievements } from "@/data/queries/use-achievements";
import { useWorkspaceStore } from "@/stores/workspace-store";

const ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  rocket: Rocket,
  graduation: GraduationCap,
  medal: Medal,
  zap: Zap,
  star: Star,
  crown: Crown,
  trophy: Trophy,
  flame: Flame,
  brain: Brain,
  target: Target,
  library: Library,
};

const TIER_RING: Record<AchievementTier, string> = {
  bronze: "bg-amber-500/15 text-amber-500",
  silver: "bg-zinc-400/15 text-zinc-400",
  gold: "bg-yellow-400/15 text-yellow-400",
};

const TIER_LABEL: Record<AchievementTier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

export function AchievementsPage() {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const { data, isLoading } = useAchievements(workspaceId);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
          <p className="text-sm text-muted-foreground">
            Earn badges as you learn. Progress updates automatically.
          </p>
        </div>
        {data && (
          <div className="rounded-lg border bg-card px-4 py-2 text-sm">
            <span className="font-semibold text-primary">
              {data.unlockedCount}
            </span>
            <span className="text-muted-foreground"> / {data.total} unlocked</span>
          </div>
        )}
      </header>

      {isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.statuses.map(({ def, current, unlocked, progress }) => {
            const Icon = ICONS[def.icon] ?? Trophy;
            return (
              <Card
                key={def.id}
                className={cn(
                  "transition-colors",
                  unlocked
                    ? "border-primary/30"
                    : "opacity-80 hover:opacity-100",
                )}
              >
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "relative flex size-12 shrink-0 items-center justify-center rounded-xl",
                        unlocked
                          ? TIER_RING[def.tier]
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-6" />
                      {!unlocked && (
                        <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border bg-background">
                          <Lock className="size-3 text-muted-foreground" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-semibold">{def.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {def.description}
                      </p>
                    </div>
                  </div>

                  {unlocked ? (
                    <p className="text-xs font-medium text-primary">
                      Unlocked · {TIER_LABEL[def.tier]}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      <Progress value={progress * 100} className="h-1.5" />
                      <p className="text-right text-[11px] text-muted-foreground">
                        {Math.min(current, def.threshold)} / {def.threshold}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
