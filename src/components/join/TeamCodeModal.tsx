import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';
import { useTeamJoin } from '@/hooks/use-team-join';

import { TeamCodeError } from './TeamCodeError';
import { TeamCodeInput } from './TeamCodeInput';
import { TeamCodeSubmitButton } from './TeamCodeSubmitButton';

interface TeamCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamCodeModal({ open, onOpenChange }: TeamCodeModalProps) {
  const [code, setCode] = useState('');
  const { t } = useTranslation('join');
  const { validateAndJoin, loading, error } = useTeamJoin();

  const handleJoin = () => {
    validateAndJoin(code);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t('codeModal.title')}
      description={t('codeModal.description')}
      contentClassName="sm:max-w-md rounded-3xl"
    >
      <div className="space-y-6 py-4">
        <TeamCodeInput
          value={code}
          onChange={setCode}
          onEnter={handleJoin}
          disabled={loading}
        />

        <TeamCodeError message={error} />

        <TeamCodeSubmitButton
          onClick={handleJoin}
          loading={loading}
          disabled={!code.trim()}
        />

        <p className="text-text/60 font-handwritten text-center text-sm">
          {t('codeModal.hint')}
        </p>
      </div>
    </Modal>
  );
}
