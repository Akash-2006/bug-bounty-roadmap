import { PanelLeft, Search, Flame } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useUiStore } from "@/stores/ui-store"
import { mockStats } from "@/lib/mock-curriculum"

export function Topbar() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-bg px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="size-4" />
      </Button>

      <button
        type="button"
        className="flex flex-1 max-w-md items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-muted hover:border-border-strong"
      >
        <Search className="size-4" />
        <span>Search lessons, labs, notes…</span>
        <kbd className="ml-auto rounded border border-border bg-surface-raised px-1.5 py-0.5 text-[11px] text-text-faint">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-high" title="Current streak">
          <Flame className="size-4" />
          <span className="font-mono font-medium">{mockStats.currentStreakDays}d</span>
        </div>
        <div className="font-mono text-text-muted">
          <span className="text-text font-medium">{mockStats.earnedXp}</span> / {mockStats.totalXp} XP
        </div>
      </div>
    </header>
  )
}
