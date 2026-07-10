import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function PasswordInput({
  value,
  onChange,
  error,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}) {
  const { t } = useTranslation('join');
  return (
    <div className="w-full space-y-2 text-left">
      <Label
        htmlFor="password"
        className="font-handwritten text-paper-text ml-2 block text-lg"
      >
        {t('password.label')}
      </Label>
      <Input
        id="password"
        type="password"
        placeholder={t('password.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'bg-paper text-paper-text text-center text-[16px] transition-transform sm:text-lg',
          error && 'border-coral animate-shake',
        )}
      />
      {error && (
        <p className="text-coral font-rounded px-2 text-center text-xs">
          {t('password.error')}
        </p>
      )}
    </div>
  );
}
