import dayjs from 'dayjs';

import type { TeamStats } from '@/services/public-team.service';

function formatRange(first: string | null, last: string | null) {
  if (!first || !last) return null;
  const f = dayjs(first);
  const l = dayjs(last);
  if (f.isSame(l, 'day')) return f.format('MMM D');
  if (f.isSame(l, 'year')) return `${f.format('MMM D')} – ${l.format('MMM D')}`;
  return `${f.format('MMM D, YYYY')} – ${l.format('MMM D, YYYY')}`;
}

export function TripStatsStrip({ stats }: { stats: TeamStats | null }) {
  if (!stats || stats.memory_count === 0) return null;

  const range = formatRange(stats.first_memory_at, stats.last_memory_at);

  return (
    <div className="text-text/60 font-rounded mx-auto mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
      <span>📸 {stats.memory_count} memories</span>
      <span>·</span>
      <span>👥 {stats.member_count} friends</span>
      {range && (
        <>
          <span>·</span>
          <span>🗓️ {range}</span>
        </>
      )}
    </div>
  );
}
