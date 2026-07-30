import { createId } from "@/core/ids";
import { requireSupabase } from "@/lib/supabase";
import {
  exportCurriculum,
  importEnvelope,
  type ImportResult,
} from "@/data/serialization/json";

const TABLE = "published_curricula";

export interface Publication {
  id: string;
  author_email: string | null;
  source_curriculum_id: string | null;
  title: string;
  summary: string | null;
  created_at: string;
}

const SELECT =
  "id, author_email, source_curriculum_id, title, summary, created_at";

/** Community sharing: publish, browse, and clone curricula (cloud mode only). */
export const publishService = {
  /** All published curricula, newest first (publicly readable). */
  async listAll(): Promise<Publication[]> {
    const { data, error } = await requireSupabase()
      .from(TABLE)
      .select(SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Publication[];
  },

  /** The current user's publication for a given source curriculum, if any. */
  async getBySource(curriculumId: string): Promise<Publication | null> {
    const { data, error } = await requireSupabase()
      .from(TABLE)
      .select(SELECT)
      .eq("source_curriculum_id", curriculumId)
      .maybeSingle();
    if (error) throw error;
    return (data as Publication | null) ?? null;
  },

  /** Publish (or update) a snapshot of a curriculum for everyone to see. */
  async publish(curriculumId: string): Promise<void> {
    const sb = requireSupabase();
    const envelope = await exportCurriculum(curriculumId);
    if (!envelope) throw new Error("Curriculum not found.");
    const curriculum = envelope.curricula[0];
    const { data: userData } = await sb.auth.getUser();
    const existing = await this.getBySource(curriculumId);

    const { error } = await sb.from(TABLE).upsert({
      id: existing?.id ?? createId(),
      author_email: userData.user?.email ?? null,
      source_curriculum_id: curriculumId,
      title: curriculum.title,
      summary: curriculum.summary ?? null,
      doc: envelope,
    });
    if (error) throw error;
  },

  async unpublish(id: string): Promise<void> {
    const { error } = await requireSupabase().from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },

  /** Clone a published curriculum into the current user's workspace. */
  async importPublished(
    workspaceId: string,
    id: string,
  ): Promise<ImportResult> {
    const { data, error } = await requireSupabase()
      .from(TABLE)
      .select("doc")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Publication not found.");
    return importEnvelope(workspaceId, data.doc);
  },
};
