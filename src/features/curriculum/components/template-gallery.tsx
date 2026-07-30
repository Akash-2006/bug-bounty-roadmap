import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Code,
  Dumbbell,
  Languages,
  List,
  Loader2,
  Music,
  Shield,
  Sparkles,
} from "lucide-react";

import { TEMPLATES, type CurriculumTemplate } from "@/core/templates/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateFromTemplate } from "@/data/queries/use-templates";

const ICONS: Record<string, LucideIcon> = {
  code: Code,
  shield: Shield,
  languages: Languages,
  dumbbell: Dumbbell,
  music: Music,
  list: List,
};

export function TemplateGallery({
  workspaceId,
}: {
  workspaceId: string | undefined;
}) {
  const navigate = useNavigate();
  const create = useCreateFromTemplate(workspaceId);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handlePick(template: CurriculumTemplate) {
    if (!workspaceId) return;
    setPendingId(template.id);
    try {
      const curriculum = await create.mutateAsync(template);
      navigate(`/curricula/${curriculum.id}`);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Start from a template
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TEMPLATES.map((template) => {
          const Icon = ICONS[template.icon] ?? List;
          const isPending = pendingId === template.id;
          return (
            <button
              key={template.id}
              type="button"
              disabled={create.isPending}
              onClick={() => handlePick(template)}
              className="text-left disabled:opacity-60"
            >
              <Card className="h-full transition-colors hover:border-primary/40">
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Icon className="size-4" />
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {template.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{template.name}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </section>
  );
}
