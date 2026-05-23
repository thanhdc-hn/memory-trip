import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { publicTeamService } from '@/services/public-team.service';
import type { PublicTeam } from '@/services/public-team.service';
import { STORAGE_KEY, URL_PATH } from '@/utils/constants.ts';
import storage from '@/utils/storage.ts';

export function usePublicTeam(inviteCode: string | undefined) {
  const [team, setTeam] = useState<PublicTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!inviteCode) {
      setLoading(false);
      return;
    }

    const fetchTeam = async () => {
      try {
        setLoading(true);
        const data = await publicTeamService.getTeamByInviteCode(inviteCode);

        if (data) {
          // Returning user logic
          const savedTeamId = storage.get<string>(STORAGE_KEY.TEAM_ID);
          if (savedTeamId === data.id) {
            navigate(URL_PATH.TIMELINE);
            return;
          }
        }

        setTeam(data);
      } catch (err) {
        console.error('Failed to fetch team:', err);
        setError('Failed to load memory space');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [inviteCode, navigate]);

  const joinTeam = (nickname: string) => {
    if (!team) return;

    localStorage.setItem('team_id', team.id);
    localStorage.setItem('nickname', nickname.trim());
    localStorage.setItem('joined_at', Date.now().toString());

    // Refresh page to ensure Supabase client gets the new team_id header
    window.location.href = URL_PATH.TIMELINE;
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    if (!team) return false;
    try {
      return await publicTeamService.verifyPassword(team.id, password);
    } catch (err) {
      console.error('Password verification failed:', err);
      return false;
    }
  };

  return {
    team,
    loading,
    error,
    joinTeam,
    verifyPassword,
  };
}
