import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

// Mock weekly XP — will be derived from the progress store once lesson
// completion timestamps exist (Phase 3+).
const data = [
  { week: "W1", xp: 100 },
  { week: "W2", xp: 220 },
  { week: "W3", xp: 340 },
  { week: "W4", xp: 400 },
  { week: "W5", xp: 480 },
  { week: "W6", xp: 560 },
  { week: "W7", xp: 675 },
]

export function XpTrendChart() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-1 font-display text-sm font-semibold text-text">
        XP over time
      </h3>
      <p className="mb-4 text-xs text-text-muted">Cumulative XP earned by week</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--high)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--high)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" vertical={false} />
            <XAxis
              dataKey="week"
              stroke="var(--text-faint)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="var(--text-faint)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border-c)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--text)",
              }}
            />
            <Area
              type="monotone"
              dataKey="xp"
              stroke="var(--high)"
              strokeWidth={2}
              fill="url(#xpFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
