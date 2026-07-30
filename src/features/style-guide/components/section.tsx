import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/** A titled block within the style guide. */
export function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div className="space-y-1 border-b pb-3">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

interface SwatchProps {
  name: string;
  /** Tailwind background class, e.g. "bg-primary". */
  className: string;
  /** Whether text on the swatch should be light or dark. */
  foreground?: string;
}

export function Swatch({ name, className, foreground }: SwatchProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div
        className={cn(
          "flex h-16 items-end p-2 text-[11px] font-medium",
          className,
          foreground,
        )}
      >
        {name}
      </div>
    </div>
  );
}
