import { useEffect, useState } from 'react';

import storage from '@/utils/storage.ts';

export function useTooltipState(key: string) {
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = storage.get<boolean>(key) as boolean;
    setIsDismissed(stored);
    setIsLoaded(true);
  }, [key]);

  const dismiss = () => {
    storage.set(key, true);
    setIsDismissed(true);
  };

  return {
    showTooltip: isLoaded && !isDismissed,
    dismiss,
  };
}
