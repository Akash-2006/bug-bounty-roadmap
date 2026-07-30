import { motion } from "framer-motion";
import {
  BookOpen,
  CircleCheck,
  Flame,
  Library,
  Play,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/data/queries/use-dashboard";
import { ActivityChart } from "@/features/dashboard/components/activity-chart";
import { Hero3D } from "@/features/dashboard/components/hero-3d";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { useWorkspaceStore } from "@/stores/workspace-store";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

function formatWhen(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function DashboardPage() {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const { data, isLoading } = useDashboard(workspaceId);

  if (isLoading || !data) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (data.curriculaCount === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <EmptyState
          icon={Library}
          title="Welcome to Bug Bounty University"
          description="Create your first curriculum to start building a structured learning path — for anything you want to master."
          action={
            <Button asChild>
              <Link to="/curricula">
                <BookOpen /> Create a curriculum
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const continueHref = data.continueTarget
    ? `/curricula/${data.continueTarget.curriculumId}/n/${data.continueTarget.node.id}`
    : "/curricula";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-accent/60 via-card to-card p-6 sm:p-8"
      >
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-3xl" />
        <Hero3D className="absolute inset-y-0 right-0 hidden h-full w-1/2 opacity-90 md:block [mask-image:linear-gradient(to_left,black_40%,transparent)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Level {data.level.level} · {data.xp.toLocaleString()} XP
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {data.continueTarget
                ? "Pick up where you left off."
                : "You're all caught up. Nice work!"}
            </h1>
            <p className="text-muted-foreground">
              {data.continueTarget
                ? `Next: ${data.continueTarget.node.title} · ${data.continueTarget.curriculumTitle}`
                : "Add more lessons or start a new curriculum to keep learning."}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild>
                <Link to={continueHref}>
                  <Play className="size-4" />
                  {data.continueTarget
                    ? "Continue learning"
                    : "Browse curricula"}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/curricula">
                  <Library className="size-4" />
                  All curricula
                </Link>
              </Button>
            </div>
          </div>

          <Card className="w-full shrink-0 md:w-72">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                Overall progress
                <span className="text-muted-foreground">
                  {data.completionPct}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={data.completionPct} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {data.completedCount} / {data.lessonCount} lessons
                </span>
                <span className="inline-flex items-center gap-1">
                  <Flame className="size-3.5 text-warning" />
                  {data.streak} day streak
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Level {data.level.level}</span>
                  <span>
                    {data.level.xpIntoLevel}/{data.level.xpForLevel} XP
                  </span>
                </div>
                <Progress
                  value={data.level.pct}
                  className="h-1.5"
                  indicatorClassName="bg-warning"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard label="Curricula" value={data.curriculaCount} icon={Library} />
        <StatCard
          label="Lessons completed"
          value={`${data.completedCount}/${data.lessonCount}`}
          icon={CircleCheck}
          accentClassName="bg-success/15 text-success"
        />
        <StatCard
          label="Day streak"
          value={data.streak}
          icon={Flame}
          accentClassName="bg-warning/15 text-warning"
          hint={`${Math.round(data.minutesInvested / 60)}h invested`}
        />
        <StatCard
          label="Total XP"
          value={data.xp.toLocaleString()}
          icon={Zap}
          accentClassName="bg-primary/15 text-primary"
          hint={`Level ${data.level.level}`}
        />
      </motion.section>

      {/* Path + activity */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid gap-6 lg:grid-cols-3"
      >
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Your learning path
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/curricula">View all</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {data.perCurriculum.map(
              ({ curriculum, lessonCount, completedCount, pct }) => (
                <Link key={curriculum.id} to={`/curricula/${curriculum.id}`}>
                  <Card className="transition-colors hover:border-primary/40">
                    <CardContent className="space-y-2 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate font-medium">
                          {curriculum.title}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {completedCount}/{lessonCount} · {pct}%
                        </span>
                      </div>
                      <Progress value={pct} />
                    </CardContent>
                  </Card>
                </Link>
              ),
            )}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <ActivityChart data={data.weekly} />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="size-4 text-warning" /> Recent activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Complete a lesson to see it here.
                </p>
              ) : (
                <ul className="space-y-2">
                  {data.recent.map((r) => (
                    <li key={r.id} className="flex items-center gap-2 text-sm">
                      <CircleCheck className="size-4 shrink-0 text-success" />
                      <span className="min-w-0 flex-1 truncate">{r.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatWhen(r.at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}
