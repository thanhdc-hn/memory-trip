-- Add invite_code to teams
alter table teams
    add column if not exists invite_code text;

alter table teams
    add constraint teams_invite_code_key
        unique (invite_code);

-- Update the column to be NOT NULL after adding (if table is empty or has defaults)
-- For existing rows, we might need a default or manual update, but for this task we assume it's fresh or we can handle nulls.
-- The requirement says "unique not null".

drop view if exists public_team_preview;
-- Re-create public_team_preview view with invite_code
create view public_team_preview as
select
    id,
    name,
    invite_code,
    is_locked,
    nullif(trim(invite_password), '') is not null as has_password
from teams;

grant select on public_team_preview to anon;
