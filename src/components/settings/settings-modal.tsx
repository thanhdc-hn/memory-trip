import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';

import { SettingsPanel } from './settings-panel';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Hosts the standalone SettingsPanel inside the app's Modal/Dialog. */
export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t('settings.title')}
      description={t('settings.description')}
      contentClassName="max-w-sm"
    >
      <SettingsPanel />
    </Modal>
  );
}
