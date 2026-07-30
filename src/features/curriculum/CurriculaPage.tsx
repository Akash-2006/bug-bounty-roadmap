import { GraduationCap, Library } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurricula } from "@/data/queries/use-curricula";
import { CreateCurriculumDialog } from "@/features/curriculum/components/create-curriculum-dialog";
import { CurriculumCard } from "@/features/curriculum/components/curriculum-card";
import { TemplateGallery } from "@/features/curriculum/components/template-gallery";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function CurriculaPage() {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const { data: curricula, isLoading } = useCurricula(workspaceId);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Curricula</h1>
          <p className="text-sm text-muted-foreground">
            Your learning universes. Create one for anything you want to master.
          </p>
        </div>
        <CreateCurriculumDialog workspaceId={workspaceId} />
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : curricula && curricula.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {curricula.map((curriculum) => (
            <CurriculumCard
              key={curriculum.id}
              curriculum={curriculum}
              workspaceId={workspaceId}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Library}
          title="No curricula yet"
          description="Create your first curriculum to start building a structured learning path — Bug Bounty, Three.js, Spanish, anything."
          action={<CreateCurriculumDialog workspaceId={workspaceId} />}
        />
      )}

      {curricula && curricula.length === 0 && (
        <div className="sr-only">
          <GraduationCap />
        </div>
      )}

      <Separator className="my-2" />
      <TemplateGallery workspaceId={workspaceId} />
    </div>
  );
}
