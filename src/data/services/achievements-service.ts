import {
  evaluateAchievements,
  type AchievementMetrics,
  type AchievementStatus,
} from "@/core/achievements/catalog";
import { computeStreak, levelFromXp } from "@/core/progress/xp";
import { activityRepo } from "@/data/repositories/activity-repo";
import { curriculumRepo } from "@/data/repositories/curriculum-repo";
import { progressRepo } from "@/data/repositories/progress-repo";

export interface AchievementsResult {
  metrics: AchievementMetrics;
  statuses: AchievementStatus[];
  unlockedCount: number;
  total: number;
}

/**
 * Derive the achievement metrics and unlock status for a workspace from the
 * activity log, progress, and curricula (ADR 0006). Nothing is separately
 * persisted — achievements are a pure view over existing data.
 */
export const achievementsService = {
  async getStatus(workspaceId: string): Promise<AchievementsResult> {
    const [curricula, progress, activities] = await Promise.all([
      curriculumRepo.listByWorkspace(workspaceId),
      progressRepo.listByWorkspace(workspaceId),
      activityRepo.listByWorkspace(workspaceId),
    ]);

    const xp = activities.reduce((sum, a) => sum + (a.xp ?? 0), 0);
    const metrics: AchievementMetrics = {
      lessonsCompleted: progress.filter((p) => p.status === "completed").length,
      xp,
      level: levelFromXp(xp).level,
      streak: computeStreak(activities.map((a) => a.at)),
      quizzesPassed: activities.filter((a) => a.type === "quiz.passed").length,
      curricula: curricula.length,
    };

    const statuses = evaluateAchievements(metrics);
    return {
      metrics,
      statuses,
      unlockedCount: statuses.filter((s) => s.unlocked).length,
      total: statuses.length,
    };
  },
};
