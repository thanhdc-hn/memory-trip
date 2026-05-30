import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

export function FloatingControls() {
  const { t, i18n } = useTranslation();

  const nextLang = i18n.language === 'vi' ? 'en' : 'vi';

  return (
    <div className="fixed right-3 bottom-3 z-50 flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label={t('changeLanguage')}
        onClick={() => i18n.changeLanguage(nextLang)}
      >
        <span className="text-xs font-bold uppercase">{nextLang}</span>
      </Button>
    </div>
  );
}
