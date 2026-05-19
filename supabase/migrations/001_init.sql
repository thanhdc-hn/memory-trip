create table teams
(
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    invite_password text not null,
    is_locked       boolean          default false,
    created_at      timestamptz      default now()
);

create table posts
(
    id          uuid primary key default gen_random_uuid(),
    team_id     uuid not null
        references teams (id)
            on delete cascade,
    author_name text not null,
    caption     text,
    image_url   text,
    created_at  timestamptz      default now()
);

create table admins
(
    id       uuid primary key default gen_random_uuid(),
    password text not null
);

-- Enable RLS
alter table teams enable row level security;
alter table posts enable row level security;

-- Posts: select by team header
create policy "read posts by team"
on posts for select
using (
    team_id::text = current_setting('request.headers', true)::json->>'x-team-id'
);

-- Posts: insert by team header + team not locked
create policy "insert post"
on posts for insert
with check (
    team_id::text = current_setting('request.headers', true)::json->>'x-team-id'
    and exists (
        select 1 from teams
        where teams.id = posts.team_id
        and teams.is_locked = false
    )
);

-- Storage usage function (for admin dashboard)
create or replace function get_storage_usage()
returns json as $$
    select json_build_object(
        'total_size', coalesce(sum((metadata->>'size')::bigint), 0)
    )
    from storage.objects;
$$ language sql security definer;

