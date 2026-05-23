import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { publicTeamService } from '@/services/public-team.service';
import { URL_PATH } from '@/utils/constants.ts';

export function useTeamJoin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateAndJoin = async (inviteCode: string) => {
    if (!inviteCode.trim()) {
      setError('Please enter a team code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const team = await publicTeamService.getTeamByInviteCode(inviteCode);

      if (team) {
        navigate(`${URL_PATH.JOIN}/${team.invite_code}`);
      } else {
        setError('Oops! Team not found. Please ask your trip organizer! 💫');
      }
    } catch (err: any) {
      console.error('Error joining team:', err);
      if (err.message === 'Failed to fetch') {
        setError('Network error. Please check your connection! 🌐');
      } else {
        setError('Oops! Team not found. Please ask your trip organizer! 💫');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    validateAndJoin,
    loading,
    error,
    setError,
  };
}
