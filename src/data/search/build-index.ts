import type { SearchDoc } from "@/core/search/types";
import { curriculumRepo } from "@/data/repositories/curriculum-repo";
import { nodeRepo } from "@/data/repositories/node-repo";

/**
 * Project the workspace's curricula and nodes into flat search documents.
 * Runs on demand and is cached by the query layer.
 */
export async function buildSearchDocs(
  workspaceId: string,
): Promise<SearchDoc[]> {
  const curricula = await curriculumRepo.listByWorkspace(workspaceId);
  const docs: SearchDoc[] = [];

  for (const curriculum of curricula) {
    docs.push({
      id: curriculum.id,
      type: "curriculum",
      title: curriculum.title,
      subtitle: curriculum.summary,
      tags: [],
      path: `/curricula/${curriculum.id}`,
      kindLabel: "Curriculum",
    });

    const levelLabel = new Map(
      curriculum.scheme.levels.map((l) => [l.key, l.singular]),
    );
    const nodes = await nodeRepo.listByCurriculum(curriculum.id);
    for (const node of nodes) {
      docs.push({
        id: node.id,
        type: "node",
        title: node.title,
        subtitle: node.summary || curriculum.title,
        tags: node.tags,
        path: `/curricula/${curriculum.id}/n/${node.id}`,
        kindLabel: levelLabel.get(node.levelKey) ?? "Lesson",
      });
    }
  }

  return docs;
}
