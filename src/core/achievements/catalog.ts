/**
 * Achievement catalog (ADR 0010 philosophy: achievements are a *view* derived
 * from the activity log + progress, not separately persisted state). Each
 * definition targets a single metric and threshold.
 */

export type AchievementMetric =
  | "lessonsCompleted"
  | "xp"
  | "level"
  | "streak"
  | "quizzesPassed"
  | "curricula";

export type AchievementTier = "bronze" | "silver" | "gold";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  /** Semantic icon key, mapped to a component in the UI. */
  icon: string;
  metric: AchievementMetric;
  threshold: number;
  tier: AchievementTier;
}

export interface AchievementMetrics {
  lessonsCompleted: number;
  xp: number;
  level: number;
  streak: number;
  quizzesPassed: number;
  curricula: number;
}

export interface AchievementStatus {
  def: AchievementDef;
  current: number;
  unlocked: boolean;
  /** 0–1 progress toward the threshold. */
  progress: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first-steps", title: "First Steps", description: "Complete your first lesson", icon: "footprints", metric: "lessonsCompleted", threshold: 1, tier: "bronze" },
  { id: "getting-going", title: "Getting Going", description: "Complete 5 lessons", icon: "rocket", metric: "lessonsCompleted", threshold: 5, tier: "bronze" },
  { id: "scholar", title: "Scholar", description: "Complete 25 lessons", icon: "graduation", metric: "lessonsCompleted", threshold: 25, tier: "silver" },
  { id: "devoted", title: "Devoted", description: "Complete 100 lessons", icon: "medal", metric: "lessonsCompleted", threshold: 100, tier: "gold" },

  { id: "xp-100", title: "Novice", description: "Earn 100 XP", icon: "zap", metric: "xp", threshold: 100, tier: "bronze" },
  { id: "xp-500", title: "Adept", description: "Earn 500 XP", icon: "star", metric: "xp", threshold: 500, tier: "silver" },
  { id: "xp-1000", title: "Master", description: "Earn 1,000 XP", icon: "crown", metric: "xp", threshold: 1000, tier: "gold" },

  { id: "level-5", title: "Level 5", description: "Reach level 5", icon: "trophy", metric: "level", threshold: 5, tier: "silver" },

  { id: "streak-3", title: "Warming Up", description: "Hit a 3-day streak", icon: "flame", metric: "streak", threshold: 3, tier: "bronze" },
  { id: "streak-7", title: "On Fire", description: "Hit a 7-day streak", icon: "flame", metric: "streak", threshold: 7, tier: "silver" },
  { id: "streak-30", title: "Unstoppable", description: "Hit a 30-day streak", icon: "flame", metric: "streak", threshold: 30, tier: "gold" },

  { id: "quiz-1", title: "Quiz Whiz", description: "Pass your first quiz", icon: "brain", metric: "quizzesPassed", threshold: 1, tier: "bronze" },
  { id: "quiz-5", title: "Sharpshooter", description: "Pass 5 quizzes", icon: "target", metric: "quizzesPassed", threshold: 5, tier: "silver" },

  { id: "creator", title: "Creator", description: "Create a curriculum", icon: "library", metric: "curricula", threshold: 1, tier: "bronze" },
  { id: "architect", title: "Architect", description: "Create 3 curricula", icon: "library", metric: "curricula", threshold: 3, tier: "silver" },
];

/** Evaluate the whole catalog against a metrics snapshot. */
export function evaluateAchievements(
  metrics: AchievementMetrics,
): AchievementStatus[] {
  return ACHIEVEMENTS.map((def) => {
    const current = metrics[def.metric];
    return {
      def,
      current,
      unlocked: current >= def.threshold,
      progress: Math.min(1, def.threshold > 0 ? current / def.threshold : 0),
    };
  });
}
