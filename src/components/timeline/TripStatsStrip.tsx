import dayjs from 'dayjs';

import { useTranslation } from 'react-i18next';

import type { TeamStats } from '@/services/public-team.service';
import { getDateFormat } from '@/utils/time';

function formatRange(first: string | null, last: string | null, lang: string) {
  if (!first || !last) return null;
  const f = dayjs(first);
  const l = dayjs(last);
  const fmt = getDateFormat(lang);
  if (f.isSame(l, 'day')) return f.format('D MMM');
  if (f.isSame(l, 'year')) return `${f.format('D MMM')} – ${l.format('D MMM')}`;
  return `${f.format(fmt)} – ${l.format(fmt)}`;
}

export function TripStatsStrip({ stats }: { stats: TeamStats | null }) {
  const { t, i18n } = useTranslation('timeline');
  if (!stats || stats.memory_count === 0) return null;

  const range = formatRange(
    stats.first_memory_at,
    stats.last_memory_at,
    i18n.language,
  );

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
