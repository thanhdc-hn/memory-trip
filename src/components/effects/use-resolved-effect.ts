import { useEffect, useState } from 'react';

import { useEffectStore } from '@/store/effect.store';

import { resolveEffect } from './effect-utils';
import { type EffectId } from './effects';

/**
 * The effect that should currently render (`null` when off), derived from the
 * persisted selection plus the current date.
 *
 * `now` only matters for the `auto` selection; it is refreshed when the tab
 * regains visibility so a long-lived PWA session that crosses a season boundary
 * updates on next focus. Reduced-motion gating lives in the rendering layer, not
 * here, so this hook stays a pure selection→effect resolver.
 */
export function useResolvedEffect(): EffectId | null {
  const selection = useEffectStore((state) => state.selection);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        setNow(new Date());
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return resolveEffect(selection, now);
}
