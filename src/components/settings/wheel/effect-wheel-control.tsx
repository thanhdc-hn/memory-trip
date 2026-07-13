import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EFFECTS, type EffectSelection } from '@/components/effects/effects';
import { usePrefersReducedMotion } from '@/components/effects/use-prefers-reduced-motion';
import { Button } from '@/components/ui/button';
import { useEffectPreview, useEffectSelection } from '@/store/effect.store';

import { WheelPickerModal } from './wheel-picker-modal';

const EFFECT_OPTIONS = [
  { id: 'auto', labelKey: 'effect.auto', icon: '🪄' },
  { id: 'off', labelKey: 'effect.off', icon: '🚫' },
  ...EFFECTS.map((e) => ({ id: e.id, labelKey: e.labelKey, icon: e.icon })),
] as const;

export function EffectWheelControl() {
  const { t } = useTranslation();
  const { selection, setSelection } = useEffectSelection();
  const { setPreview, clearPreview } = useEffectPreview();
  const reducedMotion = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const activeOption = EFFECT_OPTIONS.find((o) => o.id === selection);

  const items = EFFECT_OPTIONS.map((opt) => ({
    id: opt.id as string,
    label: t(opt.labelKey),
    icon: opt.icon,
  }));

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleConfirm = (val: string) => {
    // Commit the selection (this also clears the transient preview).
    setSelection(val as EffectSelection);
    setIsOpen(false);
  };

  const handlePreview = (val: string) => {
    // Live, non-persisted preview while the user rotates the wheel.
    setPreview(val as EffectSelection);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Discard the preview so we fall back to the persisted selection.
      clearPreview();
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
          <span aria-hidden="true">{activeOption?.icon}</span>
          <span className="truncate">
            {activeOption ? t(activeOption.labelKey) : selection}
          </span>
        </div>
        <span className="text-muted-foreground ml-2 opacity-70">🎡</span>
      </Button>

      <WheelPickerModal
        title={t('settings.effects')}
        items={items}
        value={selection}
        open={isOpen}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        onPreview={handlePreview}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
