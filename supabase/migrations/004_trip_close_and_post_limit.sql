-- =========================================================
-- TRIP CLOSE + POST LIMIT
-- Adds scheduled-closure and per-team post-limit support.
--   close_at   : when set & <= now() the trip is effectively locked
--   post_limit : max posts allowed (null = unlimited)
-- =========================================================

alter table teams
    add column if not exists close_at timestamptz;

alter table teams
    add column if not exists post_limit int;

-- =========================================================
-- PUBLIC TEAM PREVIEW
-- is_locked becomes computed so scheduled closure is enforced
-- server-side (including the posts-insert RLS policy) with no cron.
-- Column order is preserved so create-or-replace keeps the
-- existing policy dependency intact.
-- =========================================================

create or replace view public_team_preview as
select id,
       name,
       invite_code,
       (is_locked or (close_at is not null and close_at <= now())) as is_locked,
       nullif(trim(invite_password), '') is not null              as has_password,
       close_at,
       post_limit
from teams;

grant select on public_team_preview to anon;
