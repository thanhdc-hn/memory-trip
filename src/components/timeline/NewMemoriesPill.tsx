import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';

interface NewMemoriesPillProps {
  count: number;
  onClick: () => void;
}

export function NewMemoriesPill({ count, onClick }: NewMemoriesPillProps) {
  const visible = count > 0;

  return (
    <div
      className={cn(
        'safe-top fixed top-20 left-1/2 z-40 -translate-x-1/2 transition-all duration-300',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-4 opacity-0',
      )}
    >
      <button
        onClick={onClick}
        className="bg-primary animate-in zoom-in fade-in flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg ring-2 ring-white"
      >
        <ArrowUp className="h-4 w-4" />
        {count} new {count === 1 ? 'memory' : 'memories'}
      </button>
    </div>
  );
}
