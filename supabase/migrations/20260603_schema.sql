-- =========================================================
-- EXTENSIONS
-- =========================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- TEAMS
-- =========================================================

create table teams
(
    id              uuid primary key     default gen_random_uuid(),
    name            text        not null,
    invite_code     text unique not null,
    invite_password text,
    is_locked       boolean     not null default false,
    close_at        timestamptz,
    post_limit      int,
    created_at      timestamptz          default now()
);

create index idx_teams_invite_code
    on teams (invite_code);

-- =========================================================
-- POSTS
-- =========================================================

create table posts
(
    id          uuid primary key default gen_random_uuid(),
    team_id     uuid not null
        references teams (id)
            on delete cascade,
    author_name text not null,
    caption     text,
    image_path  text,
    created_at  timestamptz      default now()
);

create index idx_posts_team_id
    on posts (team_id);

create index idx_posts_created_at
    on posts (created_at desc);

-- =========================================================
-- POST REACTIONS
-- =========================================================

create table post_reactions
(
    id         uuid primary key default gen_random_uuid(),
    post_id    uuid        not null references posts (id) on delete cascade,
    team_id    uuid        not null references teams (id) on delete cascade,
    user_id    text        not null,
    created_at timestamptz not null default now()
);

-- Prevent duplicate hearts from same user
create unique index post_reactions_unique
    on post_reactions (post_id, user_id);

create index post_reactions_post_id_idx
    on post_reactions (post_id);

create index post_reactions_team_id_idx
    on post_reactions (team_id);

-- =========================================================
-- PUBLIC TEAM PREVIEW
-- is_locked is computed so scheduled closure (close_at) is enforced
-- server-side (including the posts-insert RLS policy) with no cron.
-- =========================================================

create view public_team_preview as
select id,
       name,
       invite_code,
       (is_locked or (close_at is not null and close_at <= now())) as is_locked,
       nullif(trim(invite_password), '') is not null              as has_password,
       close_at,
       post_limit
from teams;

grant select on public_team_preview to anon;

-- =========================================================
-- ENABLE RLS
-- =========================================================

alter table teams enable row level security;
alter table posts enable row level security;
alter table post_reactions enable row level security;

-- =========================================================
-- POSTS POLICIES
-- =========================================================

create policy "public read posts"
    on posts
    for select
    to anon
    using (true);

create policy "public insert posts"
    on posts
    for insert
    to anon
    with check (
    exists (select 1
            from public_team_preview
            where public_team_preview.id = posts.team_id
              and public_team_preview.is_locked = false)
    );

-- =========================================================
-- POST REACTIONS POLICIES
-- =========================================================

create policy "read reactions"
    on post_reactions
    for select
    using (true);

create policy "insert reactions"
    on post_reactions
    for insert
    with check (true);

create policy "delete reactions"
    on post_reactions
    for delete
    using (true);

-- =========================================================
-- STORAGE BUCKET
-- =========================================================

insert into storage.buckets (id,
                             name,
                             public,
                             file_size_limit,
                             allowed_mime_types)
values ('memory-images',
        'memory-images',
        true,
        5242880,
        array['image/*']);

-- =========================================================
-- STORAGE POLICIES
-- =========================================================

create policy "public upload"
    on storage.objects
    for insert
    to anon
    with check (bucket_id = 'memory-images');

create policy "public read"
    on storage.objects
    for select
    to anon
    using (bucket_id = 'memory-images');

-- =========================================================
-- STORAGE GRANTS
-- =========================================================

grant usage on schema storage to anon;
grant all on storage.objects to anon;

-- =========================================================
-- REALTIME
-- =========================================================

alter publication supabase_realtime add table posts;

-- =========================================================
-- FUNCTIONS
-- =========================================================

create or replace function verify_team_password(p_team_id uuid, p_password text)
    returns boolean
    language plpgsql
    security definer
as
$$
begin
    return exists (select 1
                   from teams
                   where id = p_team_id
                     and invite_password = p_password);
end;
$$;

create or replace function get_storage_usage()
    returns json as
$$
select json_build_object(
               'total_size', coalesce(sum((metadata ->> 'size')::bigint), 0)
       )
from storage.objects;
$$ language sql security definer;

-- Returns aggregate stats for a team's timeline:
--   memory_count    : total posts
--   member_count    : distinct author_name values
--   first_memory_at : earliest post timestamp
--   last_memory_at  : latest post timestamp
create or replace function get_team_stats(p_team_id uuid)
    returns json
    language sql
    security definer
as
$$
select json_build_object(
               'memory_count', count(*),
               'member_count', count(distinct author_name),
               'first_memory_at', min(created_at),
               'last_memory_at', max(created_at)
       )
from posts
where team_id = p_team_id;
$$;

-- =========================================================
-- GRANTS
-- =========================================================

grant usage on schema public to anon;

grant select, insert, delete on posts to anon;
grant select on public_team_preview to anon;

grant execute on function verify_team_password(uuid, text) to anon;
grant execute on function get_storage_usage() to anon;
grant execute on function get_team_stats(uuid) to anon;
