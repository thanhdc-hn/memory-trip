import { Sparkles } from 'lucide-react';

import { useTranslation } from 'react-i18next';

import { CenteredContent } from '@/components/layout/layout-primitives';

export function EmptyTimelineState() {
  const { t } = useTranslation('timeline');
  return (
    <CenteredContent className="px-4 py-20">
      <div className="animate-float text-6xl">✨</div>
      <div className="space-y-2">
        <h3 className="text-text-h text-2xl font-bold">{t('empty.title')}</h3>
        <p className="font-handwritten text-text/60 text-xl">
          {t('empty.subtitle')}
        </p>
      </div>
      <div className="text-primary font-rounded flex items-center gap-2 text-sm">
        <Sparkles className="h-4 w-4" />
        <span>{t('empty.hint')}</span>
      </div>
    </CenteredContent>
  );
}
