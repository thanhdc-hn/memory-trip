import { Lock } from 'lucide-react';

import { useTranslation } from 'react-i18next';

import { JoinCard } from './JoinCard';

export function ArchivedTeamState({ name }: { name: string }) {
  const { t } = useTranslation('join');
  return (
    <JoinCard rotation={0}>
      <div className="text-6xl">📦</div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{name}</h2>
        <div className="text-coral flex items-center justify-center gap-2 font-bold">
          <Lock className="h-4 w-4" />
          <span>{t('archived.label')}</span>
        </div>
        <p className="font-handwritten text-text/60 mt-4">
          {t('archived.description')}
        </p>
      </div>

      <div className="bg-border/50 my-2 h-[2px] w-full border-t-2 border-dashed" />

      <p className="text-text/40 font-rounded text-xs">
        {t('archived.contact')}
      </p>
    </JoinCard>
  );
}
