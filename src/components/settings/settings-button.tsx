import { Settings } from 'lucide-react';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { STORAGE_KEY } from '@/utils/constants';
import storage from '@/utils/storage';

import { SettingsModal } from './settings-modal';

/**
 * Floating settings entry point (bottom-right). Replaces the old language/theme
 * control cluster — language, theme and effect now live in the Settings modal.
 *
 * On first visit it shows a one-time hint (a pulse ring + tooltip) so users can
 * still find language switching after the visible controls were consolidated.
 * The hint is dismissed the first time settings are opened and the dismissal is
 * persisted.
 */
export function SettingsButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(() =>
    Boolean(storage.get<boolean>(STORAGE_KEY.SETTINGS_HINT_SEEN)),
  );

  const dismissHint = () => {
    if (hintDismissed) return;
    storage.set(STORAGE_KEY.SETTINGS_HINT_SEEN, true);
    setHintDismissed(true);
  };

  const openSettings = () => {
    setOpen(true);
    dismissHint();
  };

  const showHint = !hintDismissed;

  return (
    <>
      <div className="fixed right-3 bottom-3 z-50 flex items-center gap-2">
        {showHint && (
          <span
            className="bg-accent animate-in fade-in slide-in-from-right-2 rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-md"
            aria-hidden="true"
          >
            {t('settings.hint')}
          </span>
        )}
        <span className="relative inline-flex">
          {showHint && (
            <span
              className="bg-primary/40 absolute inset-0 animate-ping rounded-full"
              aria-hidden="true"
            />
          )}
          <Button
            variant="outline"
            size="icon"
            aria-label={t('settings.open')}
            onClick={openSettings}
            className="relative rounded-full shadow-md"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </Button>
        </span>
      </div>
      <SettingsModal open={open} onOpenChange={setOpen} />
    </>
  );
}
