import { useState } from "react"
import { NavLink } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, CircleDot, CheckCircle2, Circle, Bug } from "lucide-react"

import { cn } from "@/lib/utils"
import { useUiStore } from "@/stores/ui-store"
import { mockCurriculum } from "@/lib/mock-curriculum"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { LessonStatus } from "@/types/curriculum"

function StatusIcon({ status }: { status: LessonStatus }) {
  if (status === "completed")
    return <CheckCircle2 className="size-3.5 text-info shrink-0" />
  if (status === "in-progress")
    return <CircleDot className="size-3.5 text-high shrink-0" />
  return <Circle className="size-3.5 text-text-faint shrink-0" />
}

/**
 * Roadmap-tree navigation: Semester -> Module -> Week -> Lesson, rendered
 * as nested, collapsible branches with a connecting spine — the visual
 * signature borrowed from roadmap.sh, but color-coded with our own
 * severity/status language instead of a generic progress bar.
 */
export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)

  return (
    <aside
      className={cn(
        "h-full shrink-0 border-r border-border bg-surface transition-[width] duration-200 ease-out",
        collapsed ? "w-0 overflow-hidden border-r-0" : "w-72"
      )}
      aria-hidden={collapsed}
    >
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Bug className="size-5 text-high" />
        <span className="font-display text-sm font-semibold tracking-tight">
          Bug Bounty University
        </span>
      </div>
      <ScrollArea className="h-[calc(100%-3.5rem)]">
        <nav className="px-2 py-3" aria-label="Curriculum">
          {mockCurriculum.map((semester) => (
            <SemesterNode key={semester.id} semester={semester} />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}

function SemesterNode({ semester }: { semester: (typeof mockCurriculum)[number] }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="mb-1">
      <TreeToggle label={semester.title} open={open} onToggle={() => setOpen(!open)} />
      <BranchList open={open}>
        <div className="ml-3 border-l border-border pl-3">
          {semester.modules.map((mod) => (
            <ModuleNode key={mod.id} module={mod} />
          ))}
        </div>
      </BranchList>
    </div>
  )
}

function ModuleNode({ module }: { module: (typeof mockCurriculum)[number]["modules"][number] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-0.5">
      <TreeToggle label={module.title} open={open} onToggle={() => setOpen(!open)} size="sm" />
      <BranchList open={open}>
        <div className="ml-3 border-l border-border pl-3">
          {module.weeks.map((week) => (
            <WeekNode key={week.id} week={week} />
          ))}
        </div>
      </BranchList>
    </div>
  )
}

function WeekNode({ week }: { week: (typeof mockCurriculum)[number]["modules"][number]["weeks"][number] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-0.5">
      <TreeToggle label={week.title} open={open} onToggle={() => setOpen(!open)} size="xs" />
      <BranchList open={open}>
        <div className="ml-3 border-l border-border pl-3">
          {week.lessons.map((lesson) => (
            <NavLink
              key={lesson.id}
              to={`/lesson/${lesson.slug}`}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-text-muted hover:bg-surface-raised hover:text-text",
                  isActive && "bg-surface-raised text-text"
                )
              }
            >
              <StatusIcon status={lesson.status} />
              <span className="truncate">{lesson.title}</span>
            </NavLink>
          ))}
        </div>
      </BranchList>
    </div>
  )
}

function TreeToggle({
  label,
  open,
  onToggle,
  size = "md",
}: {
  label: string
  open: boolean
  onToggle: () => void
  size?: "md" | "sm" | "xs"
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-text-muted hover:bg-surface-raised hover:text-text",
        size === "md" && "font-display text-[13px] font-semibold text-text",
        size === "sm" && "text-[13px] font-medium",
        size === "xs" && "text-[12px]"
      )}
    >
      <ChevronRight
        className={cn(
          "size-3.5 shrink-0 transition-transform duration-150",
          open && "rotate-90"
        )}
      />
      <span className="truncate">{label}</span>
    </button>
  )
}

function BranchList({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
