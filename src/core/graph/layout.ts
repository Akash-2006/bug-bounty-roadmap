import type { TreeNode } from "@/core/tree";

export interface NodePosition {
  x: number;
  y: number;
}

const X_GAP = 280;
const Y_GAP = 84;

/**
 * A compact tidy-tree layout: depth maps to the x axis (left → right), and
 * leaves are stacked on the y axis with internal nodes centered over their
 * children. Deterministic, dependency-free, good enough for curriculum trees.
 */
export function layoutTree(tree: TreeNode[]): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  let leafCursor = 0;

  const assign = (item: TreeNode): number => {
    const x = item.depth * X_GAP;
    let y: number;

    if (item.children.length === 0) {
      y = leafCursor * Y_GAP;
      leafCursor += 1;
    } else {
      const childYs = item.children.map(assign);
      y = (childYs[0] + childYs[childYs.length - 1]) / 2;
    }

    positions.set(item.node.id, { x, y });
    return y;
  };

  for (const root of tree) assign(root);
  return positions;
}
