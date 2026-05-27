create table if not exists post_reactions (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references posts(id) on delete cascade,
    team_id uuid not null references teams(id) on delete cascade,
    user_id text not null,
    created_at timestamptz not null default now()
);

-- Prevent duplicate hearts from same user
create unique index if not exists post_reactions_unique
    on post_reactions(post_id, user_id);

-- Helpful indexes
create index if not exists post_reactions_post_id_idx
    on post_reactions(post_id);

create index if not exists post_reactions_team_id_idx
    on post_reactions(team_id);

-- Enable RLS
alter table post_reactions enable row level security;

-- Read reactions
create policy "read reactions"
on post_reactions
for select
using (true);

-- Insert reactions
create policy "insert reactions"
on post_reactions
for insert
with check (true);

-- Delete reactions (users can delete their own based on fingerprint)
create policy "delete reactions"
on post_reactions
for delete
using (true);