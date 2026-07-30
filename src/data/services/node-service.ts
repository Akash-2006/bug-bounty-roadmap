import { SCHEMA_VERSION } from "@/core/constants";
import { eventBus } from "@/core/events/event-bus";
import { createId } from "@/core/ids";
import { compareOrder, orderAfter, orderBetween } from "@/core/ordering";
import { slugify } from "@/core/slug";
import type {
  CreateNodeInput,
  CurriculumNode,
  UpdateNodeInput,
} from "@/core/schemas/node";
import { nodeRepo } from "@/data/repositories/node-repo";

/** Siblings of a node (same parent), ordered by fractional key. */
function siblingsOf(
  nodes: CurriculumNode[],
  parentId: string | null,
): CurriculumNode[] {
  return nodes
    .filter((n) => n.parentId === parentId)
    .sort((a, b) => compareOrder(a.order, b.order));
}

/** Node use-cases (ADR 0006): create, edit, reorder, move, delete. */
export const nodeService = {
  list: nodeRepo.listByCurriculum,
  get: nodeRepo.get,

  async create(
    workspaceId: string,
    curriculumId: string,
    input: CreateNodeInput,
  ): Promise<CurriculumNode> {
    const nodes = await nodeRepo.listByCurriculum(curriculumId);
    const siblings = siblingsOf(nodes, input.parentId);
    const lastOrder = siblings.at(-1)?.order ?? null;

    const now = Date.now();
    const node: CurriculumNode = {
      id: createId(),
      schemaVersion: SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      workspaceId,
      curriculumId,
      parentId: input.parentId,
      levelKey: input.levelKey,
      title: input.title,
      slug: slugify(input.title) || createId(),
      summary: input.summary,
      order: orderAfter(lastOrder),
      body: "",
      xp: 0,
      tags: [],
      objectives: [],
    };
    await nodeRepo.save(node);
    eventBus.emit("node.created", { curriculumId, nodeId: node.id });
    return node;
  },

  async update(
    id: string,
    patch: UpdateNodeInput,
  ): Promise<CurriculumNode | undefined> {
    const existing = await nodeRepo.get(id);
    if (!existing) return undefined;
    const updated: CurriculumNode = {
      ...existing,
      ...patch,
      slug: patch.title ? slugify(patch.title) || existing.slug : existing.slug,
      updatedAt: Date.now(),
    };
    await nodeRepo.save(updated);
    return updated;
  },

  /** Move a node one step up or down among its siblings. */
  async reorder(id: string, direction: "up" | "down"): Promise<void> {
    const node = await nodeRepo.get(id);
    if (!node) return;
    const nodes = await nodeRepo.listByCurriculum(node.curriculumId);
    const siblings = siblingsOf(nodes, node.parentId);
    const index = siblings.findIndex((s) => s.id === id);
    if (index < 0) return;

    if (direction === "up" && index > 0) {
      const before = siblings[index - 2]?.order ?? null;
      const target = siblings[index - 1].order;
      node.order = orderBetween(before, target);
    } else if (direction === "down" && index < siblings.length - 1) {
      const target = siblings[index + 1].order;
      const after = siblings[index + 2]?.order ?? null;
      node.order = orderBetween(target, after);
    } else {
      return;
    }
    node.updatedAt = Date.now();
    await nodeRepo.save(node);
  },

  async remove(curriculumId: string, id: string): Promise<void> {
    await nodeRepo.removeSubtree(curriculumId, id);
  },

  /** Set an explicit fractional order key (used by drag-and-drop). */
  async setOrder(id: string, order: string): Promise<void> {
    const node = await nodeRepo.get(id);
    if (!node) return;
    node.order = order;
    node.updatedAt = Date.now();
    await nodeRepo.save(node);
  },
};
