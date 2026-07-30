import JSZip from "jszip";

import { slugify } from "@/core/slug";
import { buildTree, type TreeNode } from "@/core/tree";
import type { CurriculumNode } from "@/core/schemas/node";
import { exportCurriculum } from "@/data/serialization/json";
import { curriculumRepo } from "@/data/repositories/curriculum-repo";
import { nodeRepo } from "@/data/repositories/node-repo";

function yamlValue(v: string): string {
  return `"${v.replace(/"/g, '\\"')}"`;
}

/** Serialize a node to a Markdown document with YAML frontmatter (ADR 0009). */
export function nodeToMarkdown(
  node: CurriculumNode,
  levelLabel: string,
): string {
  const fm: string[] = ["---"];
  fm.push(`title: ${yamlValue(node.title)}`);
  fm.push(`level: ${node.levelKey}`);
  fm.push(`kind: ${yamlValue(levelLabel)}`);
  if (node.summary) fm.push(`summary: ${yamlValue(node.summary)}`);
  if (node.difficulty) fm.push(`difficulty: ${node.difficulty}`);
  if (node.estimatedMinutes)
    fm.push(`estimatedMinutes: ${node.estimatedMinutes}`);
  fm.push(`xp: ${node.xp}`);
  if (node.tags.length) fm.push(`tags: [${node.tags.join(", ")}]`);
  if (node.objectives.length) {
    fm.push("objectives:");
    for (const o of node.objectives) fm.push(`  - ${yamlValue(o)}`);
  }
  fm.push("---", "");

  const heading = node.body.trim().startsWith("#")
    ? ""
    : `# ${node.title}\n\n`;
  return `${fm.join("\n")}${heading}${node.body}\n`;
}

/**
 * Build a ZIP archive of a curriculum: a folder tree mirroring the hierarchy
 * with one Markdown file per node, plus a `curriculum.json` for lossless
 * round-tripping.
 */
export async function curriculumToZip(curriculumId: string): Promise<{
  blob: Blob;
  filename: string;
} | null> {
  const curriculum = await curriculumRepo.get(curriculumId);
  if (!curriculum) return null;
  const nodes = await nodeRepo.listByCurriculum(curriculumId);

  const zip = new JSZip();
  const levelLabel = new Map(
    curriculum.scheme.levels.map((l) => [l.key, l.singular]),
  );

  const tree = buildTree(nodes);
  const walk = (items: TreeNode[], folder: string[]) => {
    items.forEach((item, i) => {
      const prefix = String(i + 1).padStart(2, "0");
      const base = `${prefix}-${slugify(item.node.title) || "untitled"}`;
      const md = nodeToMarkdown(
        item.node,
        levelLabel.get(item.node.levelKey) ?? "Lesson",
      );
      zip.file([...folder, `${base}.md`].join("/"), md);
      if (item.children.length) walk(item.children, [...folder, base]);
    });
  };
  walk(tree, []);

  const envelope = await exportCurriculum(curriculumId);
  if (envelope) {
    zip.file("curriculum.json", JSON.stringify(envelope, null, 2));
  }
  zip.file(
    "README.md",
    `# ${curriculum.title}\n\n${curriculum.summary ?? ""}\n\nExported from Bug Bounty University.\n`,
  );

  const blob = await zip.generateAsync({ type: "blob" });
  return { blob, filename: `${slugify(curriculum.title) || "curriculum"}.zip` };
}
