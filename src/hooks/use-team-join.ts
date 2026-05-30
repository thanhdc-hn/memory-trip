import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { publicTeamService } from '@/services/public-team.service';
import { URL_PATH } from '@/utils/constants.ts';

export function useTeamJoin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation('join');
  const navigate = useNavigate();

  const validateAndJoin = async (inviteCode: string) => {
    if (!inviteCode.trim()) {
      setError(t('errors.empty'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const team = await publicTeamService.getTeamByInviteCode(inviteCode);

      if (team) {
        navigate(`${URL_PATH.JOIN}/${team.invite_code}`);
      } else {
        setError(t('errors.notFound'));
      }
    } catch (err: any) {
      console.error('Error joining team:', err);
      if (err.message === 'Failed to fetch') {
        setError(t('errors.network'));
      } else {
        setError(t('errors.notFound'));
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
