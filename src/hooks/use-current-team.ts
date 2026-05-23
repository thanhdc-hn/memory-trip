import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  type PublicTeam,
  publicTeamService,
} from '@/services/public-team.service';
import { STORAGE_KEY } from '@/utils/constants.ts';
import storage from '@/utils/storage.ts';

export function useCurrentTeam() {
  const [team, setTeam] = useState<PublicTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const teamId = storage.get<string>(STORAGE_KEY.TEAM_ID);
    const nickname = storage.get<string>(STORAGE_KEY.NICKNAME);

    if (!teamId || !nickname) {
      navigate('/');
      return;
    }

    const fetchTeam = async () => {
      try {
        const data = await publicTeamService.getTeam(teamId);
        if (data) {
          setTeam(data);
        } else {
          // Team no longer exists
          storage.remove(STORAGE_KEY.TEAM_ID);
          storage.remove(STORAGE_KEY.NICKNAME);
          navigate('/');
        }
      } catch (err) {
        console.error('Failed to fetch current team:', err);
        // On error, we might want to stay or redirect,
        // but for now let's just stop loading
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [navigate]);

  return { team, loading };
}
