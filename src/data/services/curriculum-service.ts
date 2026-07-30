import { SCHEMA_VERSION } from "@/core/constants";
import { eventBus } from "@/core/events/event-bus";
import {
  DEFAULT_SCHEME_KEY,
  getSchemeByKey,
} from "@/core/hierarchy/schemes";
import { createId } from "@/core/ids";
import { orderAfter } from "@/core/ordering";
import { slugify } from "@/core/slug";
import type {
  CreateCurriculumInput,
  Curriculum,
  UpdateCurriculumInput,
} from "@/core/schemas/curriculum";
import { curriculumRepo } from "@/data/repositories/curriculum-repo";

/** Curriculum use-cases (ADR 0006): creation, updates, and deletion. */
export const curriculumService = {
  list: curriculumRepo.listByWorkspace,
  get: curriculumRepo.get,

  async create(
    workspaceId: string,
    input: CreateCurriculumInput,
  ): Promise<Curriculum> {
    const scheme =
      getSchemeByKey(input.schemeKey) ?? getSchemeByKey(DEFAULT_SCHEME_KEY)!;

    const siblings = await curriculumRepo.listByWorkspace(workspaceId);
    const lastOrder = siblings.at(-1)?.order ?? null;

    const now = Date.now();
    const curriculum: Curriculum = {
      id: createId(),
      schemaVersion: SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      workspaceId,
      title: input.title,
      slug: slugify(input.title) || createId(),
      summary: input.summary,
      icon: input.icon,
      color: input.color,
      scheme,
      order: orderAfter(lastOrder),
      archivedAt: null,
    };
    await curriculumRepo.save(curriculum);
    eventBus.emit("curriculum.created", {
      workspaceId,
      curriculumId: curriculum.id,
    });
    return curriculum;
  },

  async update(
    id: string,
    patch: UpdateCurriculumInput,
  ): Promise<Curriculum | undefined> {
    const existing = await curriculumRepo.get(id);
    if (!existing) return undefined;

    const updated: Curriculum = {
      ...existing,
      ...patch,
      slug: patch.title ? slugify(patch.title) || existing.slug : existing.slug,
      updatedAt: Date.now(),
    };
    await curriculumRepo.save(updated);
    eventBus.emit("curriculum.updated", {
      workspaceId: updated.workspaceId,
      curriculumId: updated.id,
    });
    return updated;
  },

  async remove(id: string): Promise<void> {
    const existing = await curriculumRepo.get(id);
    await curriculumRepo.remove(id);
    if (existing) {
      eventBus.emit("curriculum.deleted", {
        workspaceId: existing.workspaceId,
        curriculumId: id,
      });
    }
  },
};
