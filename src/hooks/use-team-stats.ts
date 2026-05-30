import { useEffect, useState } from 'react';

import {
  type TeamStats,
  publicTeamService,
} from '@/services/public-team.service';

export function useTeamStats(teamId: string | null) {
  const [stats, setStats] = useState<TeamStats | null>(null);

  useEffect(() => {
    if (!teamId) return;
    publicTeamService
      .getTeamStats(teamId)
      .then(setStats)
      .catch((err) => console.error('Failed to fetch team stats:', err));
  }, [teamId]);

  return stats;
}
