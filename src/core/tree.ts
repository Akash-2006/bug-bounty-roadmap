import { compareOrder } from "@/core/ordering";
import type { HierarchyScheme } from "@/core/schemas/hierarchy";
import type { CurriculumNode } from "@/core/schemas/node";

/** A curriculum node with its resolved children, for rendering the tree. */
export interface TreeNode {
  node: CurriculumNode;
  depth: number;
  children: TreeNode[];
}

/**
 * Build an ordered, nested tree from a flat node list using `parentId` +
 * fractional `order` (ADR 0004). Siblings are sorted by their order key.
 */
export function buildTree(nodes: CurriculumNode[]): TreeNode[] {
  const byParent = new Map<string | null, CurriculumNode[]>();
  for (const node of nodes) {
    const key = node.parentId;
    const bucket = byParent.get(key) ?? [];
    bucket.push(node);
    byParent.set(key, bucket);
  }

  const build = (parentId: string | null, depth: number): TreeNode[] => {
    const children = (byParent.get(parentId) ?? [])
      .slice()
      .sort((a, b) => compareOrder(a.order, b.order));
    return children.map((node) => ({
      node,
      depth,
      children: build(node.id, depth + 1),
    }));
  };

  return build(null, 0);
}

/** Index of a level within the scheme, or -1 if unknown. */
export function levelIndex(scheme: HierarchyScheme, levelKey: string): number {
  return scheme.levels.findIndex((l) => l.key === levelKey);
}

/** The level key one deeper than the given level, or null if it is the leaf. */
export function childLevelKey(
  scheme: HierarchyScheme,
  levelKey: string,
): string | null {
  const idx = levelIndex(scheme, levelKey);
  if (idx < 0 || idx >= scheme.levels.length - 1) return null;
  return scheme.levels[idx + 1].key;
}

/** Whether nodes at this level can contain children. */
export function canHaveChildren(
  scheme: HierarchyScheme,
  levelKey: string,
): boolean {
  return childLevelKey(scheme, levelKey) !== null;
}

/** Collect a node id and all of its descendant ids (for cascade delete). */
export function collectSubtreeIds(
  nodes: CurriculumNode[],
  rootId: string,
): string[] {
  const childrenOf = new Map<string, string[]>();
  for (const node of nodes) {
    if (node.parentId) {
      const bucket = childrenOf.get(node.parentId) ?? [];
      bucket.push(node.id);
      childrenOf.set(node.parentId, bucket);
    }
  }
  const result: string[] = [];
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop()!;
    result.push(id);
    for (const child of childrenOf.get(id) ?? []) stack.push(child);
  }
  return result;
}
