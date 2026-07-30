import type { LucideIcon } from "lucide-react";

import { TiltCard } from "@/components/common/tilt-card";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accentClassName?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accentClassName,
}: StatCardProps) {
  return (
    <TiltCard className="group h-full">
      <Card className="h-full overflow-hidden transition-colors hover:border-primary/40">
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground [transform:translateZ(30px)]",
              accentClassName,
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 [transform:translateZ(18px)]">
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            <p className="truncate text-sm text-muted-foreground">{label}</p>
            {hint && (
              <p className="truncate text-xs text-muted-foreground/70">{hint}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </TiltCard>
  );
}
