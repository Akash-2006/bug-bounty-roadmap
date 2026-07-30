import { motion } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  FlaskConical,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCurriculum, getCurriculumStats } from "@/content/loader";
import { ActivityChart } from "@/features/dashboard/components/activity-chart";
import { CurriculumPath } from "@/features/dashboard/components/curriculum-path";
import { StatCard } from "@/features/dashboard/components/stat-card";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const stats = getCurriculumStats();
  const { semesters } = getCurriculum();

  // Progress tracking lands in a later phase; start everyone at zero.
  const completed = 0;
  const progressPct =
    stats.lessons > 0 ? Math.round((completed / stats.lessons) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-accent/60 via-card to-card p-6 sm:p-8"
      >
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Welcome to Bug Bounty University
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Learn to hack the web, methodically.
            </h1>
            <p className="text-muted-foreground">
              A structured path from HTTP fundamentals to advanced exploitation —
              reading, labs, and assignments in one place.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild>
                <Link to="/learn">
                  <BookOpen className="size-4" />
                  Start learning
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/labs">
                  <FlaskConical className="size-4" />
                  Browse labs
                </Link>
              </Button>
            </div>
          </div>

          <Card className="w-full shrink-0 md:w-72">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                Overall progress
                <span className="text-muted-foreground">{progressPct}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={progressPct} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {completed} / {stats.lessons} lessons
                </span>
                <span className="inline-flex items-center gap-1">
                  <Zap className="size-3.5 text-warning" />0 XP
                </span>
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
        <StatCard
          label="Lessons"
          value={stats.lessons}
          icon={BookOpen}
          hint={`${stats.modules} modules`}
        />
        <StatCard
          label="Hands-on labs"
          value={stats.labs}
          icon={FlaskConical}
          accentClassName="bg-primary/15 text-primary"
        />
        <StatCard
          label="Assignments"
          value={stats.assignments}
          icon={ClipboardList}
          accentClassName="bg-warning/15 text-warning"
        />
        <StatCard
          label="XP available"
          value={stats.totalXp.toLocaleString()}
          icon={Zap}
          accentClassName="bg-success/15 text-success"
          hint={`~${Math.round(stats.totalMinutes / 60)}h of content`}
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
              <Link to="/learn">View all</Link>
            </Button>
          </div>
          <CurriculumPath semesters={semesters} />
        </div>
        <div className="lg:col-span-1">
          <ActivityChart />
        </div>
      </motion.section>
    </div>
  );
}
