import { ArrowRight, Loader2 } from 'lucide-react';

import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TeamCodeSubmitButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function TeamCodeSubmitButton({
  onClick,
  loading,
  disabled,
}: TeamCodeSubmitButtonProps) {
  const { t } = useTranslation('join');
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'bg-secondary hover:bg-secondary/90 h-14 w-full rounded-2xl text-lg shadow-lg transition-all',
        'flex items-center justify-center gap-2',
      )}
    >
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <>
          {t('codeModal.submit')} <ArrowRight className="h-5 w-5" />
        </>
      )}
    </Button>
  );
}
