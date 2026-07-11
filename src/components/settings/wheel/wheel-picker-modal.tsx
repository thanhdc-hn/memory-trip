import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

import { type RadialItem, RadialWheelPicker } from './radial-wheel-picker';

interface WheelPickerModalProps<T> {
  title: string;
  items: RadialItem<T>[];
  value: T;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (value: T) => void;
  onPreview?: (value: T) => void;
  reducedMotion?: boolean;
}

export function WheelPickerModal<T>({
  title,
  items,
  value,
  open,
  onOpenChange,
  onConfirm,
  onPreview,
  reducedMotion,
}: WheelPickerModalProps<T>) {
  const { t } = useTranslation();
  const [localValue, setLocalValue] = React.useState<T>(value);

  // Sync local value when modal opens
  React.useEffect(() => {
    if (open) {
      setLocalValue(value);
    }
  }, [open, value]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      contentClassName="sm:max-w-[400px] w-[95vw] p-0 rounded-[2.5rem] overflow-visible"
    >
      <div className="flex flex-col items-center justify-center overflow-visible p-4 pt-6 sm:p-8">
        <div className="relative mb-6 flex aspect-square w-full max-w-[280px] items-center justify-center overflow-visible">
          <RadialWheelPicker
            items={items}
            value={localValue}
            onChange={setLocalValue}
            onPreview={onPreview}
            onConfirm={onConfirm}
            reducedMotion={reducedMotion}
            className="h-full w-full"
          />
        </div>

        <div className="flex w-full gap-3 px-2">
          <Button
            variant="outline"
            className="border-border/50 bg-background/50 hover:bg-background/80 h-12 flex-1 rounded-2xl text-base font-semibold backdrop-blur-sm transition-all"
            onClick={() => onOpenChange(false)}
          >
            {t('cancel')}
          </Button>
          <Button
            className="h-12 flex-1 rounded-2xl text-base font-semibold shadow-lg transition-all active:scale-95"
            onClick={() => onConfirm(localValue)}
          >
            {t('confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
