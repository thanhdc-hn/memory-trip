import FingerprintJS from '@fingerprintjs/fingerprintjs';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'memory_user_id';

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(
    localStorage.getItem(STORAGE_KEY),
  );

  useEffect(() => {
    if (fingerprint) return;

    const loadFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;
        localStorage.setItem(STORAGE_KEY, visitorId);
        setFingerprint(visitorId);
      } catch (error) {
        console.error('Error generating fingerprint:', error);
      }
    };

    loadFingerprint();
  }, [fingerprint]);

  return fingerprint;
}
