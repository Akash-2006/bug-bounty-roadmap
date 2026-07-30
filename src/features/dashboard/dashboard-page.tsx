import { motion } from "framer-motion"
import { BookOpen, FlaskConical, ClipboardCheck, Trophy } from "lucide-react"

import { mockStats } from "@/lib/mock-curriculum"
import { StatCard } from "@/features/dashboard/components/stat-card"
import { XpTrendChart } from "@/features/dashboard/components/xp-trend-chart"
import { RoadmapOverview } from "@/features/dashboard/components/roadmap-overview"
import { Progress } from "@/components/ui/progress"

export function DashboardPage() {
  const lessonPct = Math.round(
    (mockStats.completedLessons / mockStats.totalLessons) * 100
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto max-w-5xl px-6 py-8"
    >
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-text">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Here's where your bug bounty training stands right now.
        </p>
      </div>

      <div className="mb-4 rounded-lg border border-border bg-surface p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-text">Overall curriculum progress</span>
          <span className="font-mono text-text-muted">{lessonPct}%</span>
        </div>
        <Progress value={lessonPct} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Lessons done"
          value={`${mockStats.completedLessons}/${mockStats.totalLessons}`}
          sublabel={`${mockStats.inProgressLessons} in progress`}
          icon={BookOpen}
          accent="text-info"
        />
        <StatCard
          label="Labs done"
          value={`${mockStats.labsCompleted}/${mockStats.labsTotal}`}
          icon={FlaskConical}
          accent="text-low"
        />
        <StatCard
          label="Assignments"
          value={`${mockStats.assignmentsCompleted}/${mockStats.assignmentsTotal}`}
          icon={ClipboardCheck}
          accent="text-medium"
        />
        <StatCard
          label="Total XP"
          value={`${mockStats.earnedXp}`}
          sublabel={`of ${mockStats.totalXp} available`}
          icon={Trophy}
          accent="text-high"
        />
      </div>

      <div className="mb-8">
        <XpTrendChart />
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-text">
          Curriculum roadmap
        </h2>
        <RoadmapOverview />
      </div>
    </motion.div>
  )
}
