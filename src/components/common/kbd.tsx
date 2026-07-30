import { cn } from "@/lib/utils";

interface KbdProps {
  keys: string[];
  className?: string;
}

/** Renders a keyboard shortcut hint, e.g. ["⌘", "K"]. */
export function Kbd({ keys, className }: KbdProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((k) => (
        <kbd
          key={k}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}
