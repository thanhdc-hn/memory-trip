import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { publicTeamService } from '@/services/public-team.service';
import type { PublicTeam } from '@/services/public-team.service';

export function usePublicTeam(teamId: string | undefined) {
  const [team, setTeam] = useState<PublicTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    // Returning user logic
    const savedTeamId = localStorage.getItem('team_id');
    if (savedTeamId === teamId) {
      navigate('/timeline');
      return;
    }

    const fetchTeam = async () => {
      try {
        setLoading(true);
        const data = await publicTeamService.getTeam(teamId);
        setTeam(data);
      } catch (err) {
        console.error('Failed to fetch team:', err);
        setError('Failed to load memory space');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId, navigate]);

  const joinTeam = (nickname: string) => {
    if (!team) return;

    localStorage.setItem('team_id', team.id);
    localStorage.setItem('nickname', nickname.trim());
    localStorage.setItem('joined_at', Date.now().toString());

    // Redirect to timeline
    navigate('/timeline');
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    if (!teamId) return false;
    try {
      return await publicTeamService.verifyPassword(teamId, password);
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
