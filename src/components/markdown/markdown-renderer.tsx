import { memo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrismPlus from "rehype-prism-plus";

import { MermaidDiagram } from "@/components/markdown/mermaid-diagram";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface HastNode {
  type?: string;
  value?: string;
  properties?: { className?: string[] | string };
  children?: HastNode[];
}

/**
 * Reconstruct raw source text from a hast node. `rehype-prism-plus` wraps each
 * source line in a `.code-line` element and strips the newline, so we re-add a
 * newline after each line to recover the original text (needed for Mermaid).
 */
function hastText(node?: HastNode): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  const cls = node.properties?.className;
  const isLine = Array.isArray(cls)
    ? cls.includes("code-line")
    : cls === "code-line";
  const inner = (node.children ?? []).map(hastText).join("");
  return isLine ? `${inner}\n` : inner;
}

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  node?: HastNode;
};

/**
 * Renders lesson Markdown with GitHub-flavored markdown, Prism syntax
 * highlighting, and Mermaid diagrams. Wrapped in `.reading` so the separate
 * reading typography system (serif, wide leading) applies (ADR 0009).
 */
export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={cn("reading", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypePrismPlus, { ignoreMissing: true }]]}
        components={{
          code({ inline, className: cls, children, node, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(cls ?? "");
            const lang = match?.[1];

            // Intercept ```mermaid fenced blocks and render as diagrams. The raw
            // source is recovered from the hast node (children are tokenized).
            if (!inline && lang === "mermaid") {
              const raw = hastText(node).replace(/\n$/, "");
              return <MermaidDiagram code={raw} />;
            }
            return (
              <code className={cls} {...props}>
                {children}
              </code>
            );
          },
          a({ href, children, ...props }) {
            return (
              <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
