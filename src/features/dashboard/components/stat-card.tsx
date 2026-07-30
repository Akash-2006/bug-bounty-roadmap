import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  accent = "text-high",
}: {
  label: string
  value: string
  sublabel?: string
  icon: LucideIcon
  accent?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {label}
        </span>
        <Icon className={cn("size-4", accent)} />
      </div>
      <div className="mt-2 font-display text-2xl font-semibold text-text">
        {value}
      </div>
      {sublabel && (
        <div className="mt-0.5 text-xs text-text-faint">{sublabel}</div>
      )}
    </div>
  )
}
