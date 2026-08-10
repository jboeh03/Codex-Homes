-- Studio v2: room-filtered materials, token-gated sessions, permanent renders,
-- private storage. Apply with `supabase db push` or the Supabase MCP
-- apply_migration tool once the project is active.

-- ---------------------------------------------------------------------------
-- materials: which room types a material applies to (bathrooms were being
-- offered kitchen backsplashes and vice versa).
alter table public.materials
  add column if not exists room_types public.room_type[]
  not null default '{kitchen,bathroom,other}';

-- designer_sessions: per-session secret (sha256 hash of a 256-bit token held
-- only by the creating browser) + storage paths instead of public URLs.
alter table public.designer_sessions
  add column if not exists client_token_hash text not null default '',
  add column if not exists photo_paths text[] not null default '{}';

-- designer_renders: one canonical staleness key shared with the client,
-- permanent storage path for the output image, and which provider made it.
alter table public.designer_renders
  add column if not exists render_key text not null default '',
  add column if not exists output_path text not null default '',
  add column if not exists provider text not null default '';

create index if not exists designer_renders_session_key_idx
  on public.designer_renders (session_id, render_key);
create index if not exists designer_renders_created_idx
  on public.designer_renders (created_at);

-- ---------------------------------------------------------------------------
-- Lock down: all session/render access now flows through server routes using
-- the service-role key. The anon key keeps read access only to materials and
-- portfolio_projects.
alter table public.designer_sessions enable row level security;
alter table public.designer_renders enable row level security;

do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('designer_sessions', 'designer_renders')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

revoke all on public.designer_sessions from anon, authenticated;
revoke all on public.designer_renders from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: renders bucket (private) + flip uploads private. Uploads and reads
-- go through server routes (service role) with short-lived signed URLs.
insert into storage.buckets (id, name, public)
  values ('designer-renders', 'designer-renders', false)
  on conflict (id) do update set public = false;

update storage.buckets set public = false where id = 'designer-uploads';

-- Remove any anon storage policies that referenced designer-uploads
-- (browser-direct uploads are gone).
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and (qual ilike '%designer-uploads%' or with_check ilike '%designer-uploads%')
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;
