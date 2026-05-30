import { Home } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { JoinCard } from './JoinCard';

export function InvalidTeamState() {
  const navigate = useNavigate();
  const { t } = useTranslation('join');

  return (
    <JoinCard rotation={-1}>
      <div className="text-6xl">🏜️</div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t('invalid.title')}</h2>
        <p className="font-handwritten text-text/60">
          {t('invalid.description')}
        </p>
      </div>

      <Button
        variant="outline"
        className="mt-4 gap-2"
        onClick={() => navigate('/')}
      >
        <Home className="h-4 w-4" />
        {t('invalid.backHome')}
      </Button>
    </JoinCard>
  );
}
