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
        <h2 className="text-paper-text text-2xl font-bold">
          {t('invalid.title')}
        </h2>
        <p className="font-handwritten text-paper-text-muted">
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
