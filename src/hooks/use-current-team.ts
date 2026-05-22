import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  type PublicTeam,
  publicTeamService,
} from '@/services/public-team.service';

export function useCurrentTeam() {
  const [team, setTeam] = useState<PublicTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const teamId = localStorage.getItem('team_id');
    const nickname = localStorage.getItem('nickname');

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
          localStorage.removeItem('team_id');
          localStorage.removeItem('nickname');
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
