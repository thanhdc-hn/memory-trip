import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePrefersReducedMotion } from '@/components/effects/use-prefers-reduced-motion';
import { useTheme } from '@/components/theme/theme-provider';
import { THEMES, type ThemeId } from '@/components/theme/themes';
import { Button } from '@/components/ui/button';

import { WheelPickerModal } from './wheel-picker-modal';

export function ThemeWheelControl() {
  const { t } = useTranslation();
  const { theme, setTheme, previewTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [originalTheme, setOriginalTheme] = useState<ThemeId>(theme);

  const activeTheme = THEMES.find((t) => t.id === theme);

  const items = THEMES.map((th) => ({
    id: th.id,
    label: t(th.labelKey),
    swatch: th.swatch,
  }));

  const handleOpen = () => {
    setOriginalTheme(theme);
    setIsOpen(true);
  };

  const handleConfirm = (val: ThemeId) => {
    setTheme(val);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Revert to original theme if closed without confirming
      previewTheme(originalTheme);
    }
    setIsOpen(open);
  };

  return (
    <>
      <Button
        variant="outline"
        className="border-border/50 bg-background/50 hover:bg-background/80 h-11 w-full justify-between rounded-xl px-3 font-normal backdrop-blur-sm transition-all"
        onClick={handleOpen}
      >
        <div className="flex items-center gap-2">
          {activeTheme && (
            <span
              className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: activeTheme.swatch }}
              aria-hidden="true"
            />
          )}
          <span className="truncate">
            {activeTheme ? t(activeTheme.labelKey) : theme}
          </span>
        </div>
        <span className="text-muted-foreground ml-2 opacity-70">🎡</span>
      </Button>

      <WheelPickerModal
        title={t('settings.theme')}
        items={items}
        value={theme}
        open={isOpen}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        onPreview={previewTheme}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
