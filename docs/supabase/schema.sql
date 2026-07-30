-- Bug Bounty University — Supabase schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
--
-- Design: each entity is stored as a single `doc` jsonb column keyed by `id`,
-- mirroring the local IndexedDB adapter. Row-level security (RLS) scopes every
-- row to its owner via `user_id`, which defaults to auth.uid() on insert.

do $$
declare
  t text;
  tables text[] := array[
    'workspaces','curricula','nodes','edges','progress','activities',
    'flashcards','quiz_questions','bookmarks','notes','assignments'
  ];
begin
  foreach t in array tables loop
    -- Table
    execute format(
      'create table if not exists public.%I (
         id text primary key,
         user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
         doc jsonb not null,
         updated_at timestamptz not null default now()
       )', t);

    -- Enable RLS
    execute format('alter table public.%I enable row level security', t);

    -- Policies (drop-then-create for idempotency)
    execute format('drop policy if exists "own_select" on public.%I', t);
    execute format('create policy "own_select" on public.%I for select using (user_id = auth.uid())', t);

    execute format('drop policy if exists "own_insert" on public.%I', t);
    execute format('create policy "own_insert" on public.%I for insert with check (user_id = auth.uid())', t);

    execute format('drop policy if exists "own_update" on public.%I', t);
    execute format('create policy "own_update" on public.%I for update using (user_id = auth.uid()) with check (user_id = auth.uid())', t);

    execute format('drop policy if exists "own_delete" on public.%I', t);
    execute format('create policy "own_delete" on public.%I for delete using (user_id = auth.uid())', t);

    -- Indexes
    execute format('create index if not exists %I on public.%I (user_id)', t || '_user_idx', t);
    execute format($ix$create index if not exists %I on public.%I ((doc->>'workspaceId'))$ix$, t || '_ws_idx', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Community sharing: publish a curriculum so ANY signed-in user can browse and
-- clone it. Rows are publicly readable; only the author can write/delete.
-- ---------------------------------------------------------------------------
create table if not exists public.published_curricula (
  id text primary key,
  author_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_email text,
  source_curriculum_id text,
  title text not null,
  summary text,
  doc jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.published_curricula enable row level security;

drop policy if exists "pub_read" on public.published_curricula;
create policy "pub_read" on public.published_curricula for select using (true);

drop policy if exists "pub_insert" on public.published_curricula;
create policy "pub_insert" on public.published_curricula for insert with check (author_id = auth.uid());

drop policy if exists "pub_update" on public.published_curricula;
create policy "pub_update" on public.published_curricula for update using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists "pub_delete" on public.published_curricula;
create policy "pub_delete" on public.published_curricula for delete using (author_id = auth.uid());

create index if not exists pub_source_idx on public.published_curricula (source_curriculum_id);
create index if not exists pub_author_idx on public.published_curricula (author_id);
