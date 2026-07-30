import { useEffect, useId, useRef, useState } from "react";

import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

/**
 * Renders a Mermaid diagram from source. Mermaid is heavy, so it's imported
 * dynamically the first time a diagram appears (keeps it out of the main
 * bundle). Re-renders when the theme changes.
 */
export function MermaidDiagram({ code }: { code: string }) {
  const id = useId().replace(/[:]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme !== "light";

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: isDark ? "dark" : "default",
          fontFamily: "inherit",
        });
        const { svg } = await mermaid.render(`mmd-${id}`, code);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Diagram error");
        }
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [code, id, isDark]);

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
        Mermaid error: {error}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "my-4 flex justify-center overflow-x-auto rounded-lg border bg-muted/40 p-4",
      )}
    />
  );
}
