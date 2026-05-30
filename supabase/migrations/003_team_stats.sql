-- =========================================================
-- TEAM STATS
-- Returns aggregate stats for a team's timeline:
--   memory_count   : total posts
--   member_count   : distinct author_name values
--   first_memory_at: earliest post timestamp
--   last_memory_at : latest post timestamp
-- =========================================================

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

grant execute on function get_team_stats(uuid) to anon;
