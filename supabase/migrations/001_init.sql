-- =========================================================
-- EXTENSIONS
-- =========================================================

create
extension if not exists "pgcrypto";

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
-- PUBLIC TEAM PREVIEW
-- =========================================================

create view public_team_preview as
select id,
       name,
       invite_code,
       is_locked,
       nullif(trim(invite_password), '') is not null as has_password
from teams;

grant select on public_team_preview to anon;

-- =========================================================
-- ENABLE RLS
-- =========================================================

alter table posts enable row level security;
alter table teams enable row level security;

-- =========================================================
-- POSTS POLICIES
-- =========================================================

create
policy "public read posts"
on posts
for
select
    to anon
    using (true);

create
policy "public insert posts"
on posts
for insert
to anon
with check (
    exists (
        select 1
        from public_team_preview
        where public_team_preview.id = posts.team_id
        and public_team_preview.is_locked = false
    )
);

create
policy "public delete posts"
on posts
for delete
to anon
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

create
policy "public upload"
on storage.objects
for insert
to anon
with check (
    bucket_id = 'memory-images'
);

create
policy "public read"
on storage.objects
for
select
    to anon
    using (
    bucket_id = 'memory-images'
    );

-- =========================================================
-- STORAGE GRANTS
-- =========================================================

grant
usage
on
schema
storage to anon;
grant all
on storage.objects to anon;

-- =========================================================
-- REALTIME
-- =========================================================

alter
publication supabase_realtime add table posts;

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
    return exists (
        select 1
        from teams
        where id = p_team_id
          and invite_password = p_password
    );
end;
$$;

create or replace function get_storage_usage()
returns json as $$
select json_build_object(
               'total_size', coalesce(sum((metadata->>'size')::bigint), 0)
       )
from storage.objects;
$$ language sql security definer;

grant execute on function verify_team_password(uuid, text) to anon;
grant execute on function get_storage_usage() to anon;

                                           grant usage on schema public to anon;

grant select, insert, delete
    on posts
    to anon;

grant select
    on public_team_preview
    to anon;