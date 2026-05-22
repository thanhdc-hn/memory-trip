import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface TeamCodeErrorProps {
  message: string | null;
}

export function TeamCodeError({ message }: TeamCodeErrorProps) {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (message) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={cn(
        'text-coral animate-in fade-in zoom-in py-2 text-center font-bold duration-300',
        shake && 'animate-shake',
      )}
    >
      {message}
    </div>
  );
}
