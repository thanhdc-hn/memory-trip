import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface IncomingFeatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IncomingFeatureModal({
  open,
  onOpenChange,
}: IncomingFeatureModalProps) {
  const { t } = useTranslation('timeline');
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t('comingSoon.title')}
      contentClassName="sm:max-w-md rounded-3xl"
      footer={
        <Button onClick={() => onOpenChange(false)} className="w-full">
          {t('comingSoon.gotIt')}
        </Button>
      }
    >
      <div className="space-y-4 py-6 text-center">
        <div className="animate-bounce text-6xl">🛠️</div>
        <p className="font-handwritten text-text/70 text-lg">
          {t('comingSoon.body')}
        </p>
      </div>
    </Modal>
  );
}
