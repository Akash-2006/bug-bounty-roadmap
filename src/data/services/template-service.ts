import type { Curriculum } from "@/core/schemas/curriculum";
import type {
  CurriculumTemplate,
  TemplateNode,
} from "@/core/templates/catalog";
import { curriculumService } from "@/data/services/curriculum-service";
import { nodeService } from "@/data/services/node-service";

/** Instantiate a curriculum from a template, seeding its starter nodes. */
export const templateService = {
  async createFromTemplate(
    workspaceId: string,
    template: CurriculumTemplate,
  ): Promise<Curriculum> {
    const curriculum = await curriculumService.create(workspaceId, {
      title: template.name,
      summary: template.summary || undefined,
      schemeKey: template.schemeKey,
    });

    const seed = async (
      nodes: TemplateNode[],
      parentId: string | null,
    ): Promise<void> => {
      for (const tn of nodes) {
        const created = await nodeService.create(workspaceId, curriculum.id, {
          parentId,
          levelKey: tn.levelKey,
          title: tn.title,
        });
        if (tn.children?.length) await seed(tn.children, created.id);
      }
    };

    await seed(template.nodes, null);
    return curriculum;
  },
};
