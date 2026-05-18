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

alter table teams enable row level security;
alter table posts enable row level security;

create
policy "read posts by team"
on posts
for
select
    using (
    team_id::text =
    current_setting('request.headers', true)::json->>'x-team-id'
    );

create
policy "insert post"
on posts
for insert
with check (
  team_id::text =
  current_setting('request.headers', true)::json->>'x-team-id'
);

       create
policy "prevent post when locked"
on posts
for insert
with check (
  exists (
    select 1 from teams
    where teams.id = posts.team_id
    and teams.is_locked = false
  )
);

