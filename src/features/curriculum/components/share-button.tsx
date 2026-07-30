import { Globe, Loader2, Share2 } from "lucide-react";

import { isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  usePublicationForCurriculum,
  usePublishCurriculum,
  useUnpublish,
} from "@/data/queries/use-publish";

/** Publish/unpublish a curriculum to the community. Cloud mode only. */
export function ShareButton({ curriculumId }: { curriculumId: string }) {
  const { data: publication } = usePublicationForCurriculum(curriculumId);
  const publish = usePublishCurriculum(curriculumId);
  const unpublish = useUnpublish(curriculumId);

  if (!isSupabaseConfigured) return null;

  const isShared = Boolean(publication);
  const busy = publish.isPending || unpublish.isPending;

  if (isShared) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => publication && unpublish.mutate(publication.id)}
        disabled={busy}
        title="Shared with everyone — click to stop sharing"
      >
        {busy ? <Loader2 className="animate-spin" /> : <Globe />}
        Shared
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => publish.mutate()}
      disabled={busy}
      title="Share this curriculum with all users"
    >
      {busy ? <Loader2 className="animate-spin" /> : <Share2 />}
      Share
    </Button>
  );
}
