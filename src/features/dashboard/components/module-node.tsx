import { Link } from "react-router-dom"

import type { ModuleSummary } from "@/types/curriculum"

function moduleProgress(mod: ModuleSummary) {
  const lessons = mod.weeks.flatMap((w) => w.lessons)
  const completed = lessons.filter((l) => l.status === "completed").length
  return { completed, total: lessons.length }
}

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * A single roadmap node: a progress ring around a module, in the spirit
 * of roadmap.sh's tree nodes. Ring color reads as "how far along" rather
 * than decoration — full ring in --info green, partial in --high amber,
 * untouched in a muted outline.
 */
export function ModuleNode({
  module,
  semesterSlug,
}: {
  module: ModuleSummary
  semesterSlug: string
}) {
  const { completed, total } = moduleProgress(module)
  const fraction = total === 0 ? 0 : completed / total
  const isComplete = fraction === 1
  const isStarted = fraction > 0

  const ringColor = isComplete
    ? "var(--info)"
    : isStarted
      ? "var(--high)"
      : "var(--border-strong)"

  return (
    <Link
      to={`/semester/${semesterSlug}/module/${module.slug}`}
      className="group flex w-44 shrink-0 flex-col items-center gap-3 rounded-lg border border-border bg-surface p-4 text-center transition-colors hover:border-border-strong hover:bg-surface-raised"
    >
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="var(--surface-raised)"
          strokeWidth="5"
        />
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
        />
        <text
          x="28"
          y="28"
          textAnchor="middle"
          dominantBaseline="central"
          transform="rotate(90 28 28)"
          className="fill-text font-mono text-[11px] font-medium"
        >
          {completed}/{total}
        </text>
      </svg>
      <div>
        <div className="font-display text-sm font-semibold text-text">
          {module.title}
        </div>
        <div className="mt-1 line-clamp-2 text-xs text-text-muted">
          {module.description}
        </div>
      </div>
    </Link>
  )
}
