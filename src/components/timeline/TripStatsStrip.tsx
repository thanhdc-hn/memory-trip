import dayjs from 'dayjs';

import { useTranslation } from 'react-i18next';

import type { TeamStats } from '@/services/public-team.service';

function formatRange(first: string | null, last: string | null) {
  if (!first || !last) return null;
  const f = dayjs(first);
  const l = dayjs(last);
  if (f.isSame(l, 'day')) return f.format('D MMM');
  if (f.isSame(l, 'year')) return `${f.format('D MMM')} – ${l.format('D MMM')}`;
  return `${f.format('D MMM, YYYY')} – ${l.format('D MMM, YYYY')}`;
}

export function TripStatsStrip({ stats }: { stats: TeamStats | null }) {
  const { t } = useTranslation('timeline');
  if (!stats || stats.memory_count === 0) return null;

  const range = formatRange(stats.first_memory_at, stats.last_memory_at);

  return (
    <div className="text-text/60 font-rounded mx-auto mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
      <span>📸 {t('stats.memories', { count: stats.memory_count })}</span>
      <span>·</span>
      <span>👥 {t('stats.friends', { count: stats.member_count })}</span>
      {range && (
        <>
          <span>·</span>
          <span>🗓️ {range}</span>
        </>
      )}
    </div>
  );
}
