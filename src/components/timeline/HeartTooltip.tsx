import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

interface HeartTooltipProps {
  show: boolean;
  className?: string;
}

export function HeartTooltip({ show, className }: HeartTooltipProps) {
  const { t } = useTranslation('timeline');
  if (!show) return null;

  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-top-2 pointer-events-none absolute -bottom-3 left-1/2 z-39 -translate-x-1/2',
        className,
      )}
    >
      <div className="bg-heart flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium whitespace-nowrap text-white shadow-lg">
        <div className="bg-heart absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45" />
        <span>{t('heartHint')}</span>
      </div>
    </div>
  );
}
