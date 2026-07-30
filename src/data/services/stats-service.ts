import { buildTree, type TreeNode } from "@/core/tree";
import { computeStreak, levelFromXp, weeklyXp } from "@/core/progress/xp";
import type { Curriculum } from "@/core/schemas/curriculum";
import type { CurriculumNode } from "@/core/schemas/node";
import { activityRepo } from "@/data/repositories/activity-repo";
import { curriculumRepo } from "@/data/repositories/curriculum-repo";
import { nodeRepo } from "@/data/repositories/node-repo";
import { progressRepo } from "@/data/repositories/progress-repo";

export interface CurriculumProgress {
  curriculum: Curriculum;
  lessonCount: number;
  completedCount: number;
  pct: number;
}

export interface ContinueTarget {
  curriculumId: string;
  curriculumTitle: string;
  node: CurriculumNode;
}

export interface RecentActivity {
  id: string;
  title: string;
  curriculumId: string;
  nodeId?: string;
  at: number;
}

export interface DashboardData {
  curriculaCount: number;
  lessonCount: number;
  completedCount: number;
  completionPct: number;
  xp: number;
  level: ReturnType<typeof levelFromXp>;
  streak: number;
  minutesInvested: number;
  weekly: { day: string; label: string; xp: number }[];
  perCurriculum: CurriculumProgress[];
  continueTarget: ContinueTarget | null;
  recent: RecentActivity[];
}

/** Collect content-bearing leaf nodes in curriculum order (depth-first). */
function flattenLeaves(tree: TreeNode[]): CurriculumNode[] {
  const leaves: CurriculumNode[] = [];
  const walk = (items: TreeNode[]) => {
    for (const item of items) {
      if (item.children.length === 0) leaves.push(item.node);
      else walk(item.children);
    }
  };
  walk(tree);
  return leaves;
}

/**
 * Aggregate the whole workspace into the numbers the dashboard needs. Reads
 * across curricula/nodes/progress/activities and derives XP, level, streak,
 * completion, and the next lesson to continue (ADR 0006).
 */
export const statsService = {
  async getDashboard(workspaceId: string): Promise<DashboardData> {
    const curricula = await curriculumRepo.listByWorkspace(workspaceId);
    const [progress, activities] = await Promise.all([
      progressRepo.listByWorkspace(workspaceId),
      activityRepo.listByWorkspace(workspaceId),
    ]);

    const completed = new Set(
      progress.filter((p) => p.status === "completed").map((p) => p.entityId),
    );

    const perCurriculum: CurriculumProgress[] = [];
    let totalLeaves = 0;
    let totalCompleted = 0;
    let minutesInvested = 0;
    let continueTarget: ContinueTarget | null = null;
    const nodeTitleById = new Map<string, string>();

    for (const curriculum of curricula) {
      const nodes = await nodeRepo.listByCurriculum(curriculum.id);
      for (const n of nodes) nodeTitleById.set(n.id, n.title);

      const leaves = flattenLeaves(buildTree(nodes));
      const doneLeaves = leaves.filter((l) => completed.has(l.id));

      totalLeaves += leaves.length;
      totalCompleted += doneLeaves.length;
      minutesInvested += doneLeaves.reduce(
        (sum, l) => sum + (l.estimatedMinutes ?? 0),
        0,
      );

      perCurriculum.push({
        curriculum,
        lessonCount: leaves.length,
        completedCount: doneLeaves.length,
        pct:
          leaves.length > 0
            ? Math.round((doneLeaves.length / leaves.length) * 100)
            : 0,
      });

      if (!continueTarget) {
        const next = leaves.find((l) => !completed.has(l.id));
        if (next) {
          continueTarget = {
            curriculumId: curriculum.id,
            curriculumTitle: curriculum.title,
            node: next,
          };
        }
      }
    }

    const xp = activities.reduce((sum, a) => sum + (a.xp ?? 0), 0);

    const recent: RecentActivity[] = activities
      .slice()
      .sort((a, b) => b.at - a.at)
      .slice(0, 6)
      .map((a) => ({
        id: a.id,
        title: a.entityId ? (nodeTitleById.get(a.entityId) ?? "Lesson") : "Activity",
        curriculumId: a.curriculumId ?? "",
        nodeId: a.entityId,
        at: a.at,
      }));

    return {
      curriculaCount: curricula.length,
      lessonCount: totalLeaves,
      completedCount: totalCompleted,
      completionPct:
        totalLeaves > 0
          ? Math.round((totalCompleted / totalLeaves) * 100)
          : 0,
      xp,
      level: levelFromXp(xp),
      streak: computeStreak(activities.map((a) => a.at)),
      minutesInvested,
      weekly: weeklyXp(activities.map((a) => ({ at: a.at, xp: a.xp }))),
      perCurriculum,
      continueTarget,
      recent,
    };
  },
};
