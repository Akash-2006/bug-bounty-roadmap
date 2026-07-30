/** XP required per level (linear tiers keep the mental model simple). */
export const XP_PER_LEVEL = 500;

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForLevel: number;
  /** 0–100 progress toward the next level. */
  pct: number;
}

/** Derive level and intra-level progress from total XP. */
export function levelFromXp(xp: number): LevelInfo {
  const safe = Math.max(0, Math.floor(xp));
  const level = Math.floor(safe / XP_PER_LEVEL) + 1;
  const xpIntoLevel = safe % XP_PER_LEVEL;
  return {
    level,
    xpIntoLevel,
    xpForLevel: XP_PER_LEVEL,
    pct: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
  };
}

/** Normalize an epoch-ms timestamp to the start of its local day. */
export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const DAY_MS = 86_400_000;

/**
 * Current daily streak: consecutive days (ending today or yesterday) that have
 * at least one activity timestamp.
 */
export function computeStreak(timestamps: number[]): number {
  if (timestamps.length === 0) return 0;
  const days = new Set(timestamps.map(startOfDay));
  const today = startOfDay(Date.now());

  // The streak may end today or yesterday (grace for "not studied yet today").
  let cursor = days.has(today) ? today : today - DAY_MS;
  if (!days.has(cursor)) return 0;

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= DAY_MS;
  }
  return streak;
}

/** Sum XP per day for the last `days` days, oldest first. */
export function weeklyXp(
  activities: { at: number; xp: number }[],
  days = 7,
): { day: string; label: string; xp: number }[] {
  const today = startOfDay(Date.now());
  const buckets: { day: string; label: string; xp: number }[] = [];
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = today - i * DAY_MS;
    const xp = activities
      .filter((a) => startOfDay(a.at) === dayStart)
      .reduce((sum, a) => sum + a.xp, 0);
    buckets.push({
      day: String(dayStart),
      label: labels[new Date(dayStart).getDay()],
      xp,
    });
  }
  return buckets;
}
