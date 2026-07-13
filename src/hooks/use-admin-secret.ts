import { type RefObject, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { URL_PATH } from '@/utils/constants.ts';

/**
 * Hook to navigate to admin page after 5 clicks on footer followed by 5 clicks outside
 */
export function useAdminSecret(footerRef: RefObject<HTMLElement | null>) {
  const navigate = useNavigate();
  const location = useLocation();
  const sequenceStage = useRef<'footer' | 'outside' | 'none'>('none');
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  useEffect(() => {
    // Reset if we are already on admin page
    if (location.pathname !== '/') return;

    const handleClick = (e: MouseEvent) => {
      const now = Date.now();
      const isFooterClick =
        footerRef.current && footerRef.current.contains(e.target as Node);

      // Reset count if more than 1 seconds between clicks
      if (now - lastClickTime.current > 1000) {
        sequenceStage.current = isFooterClick ? 'footer' : 'none';
        clickCount.current = 1;
      } else {
        if (sequenceStage.current === 'none') {
          if (isFooterClick) {
            sequenceStage.current = 'footer';
            clickCount.current = 1;
          }
        } else if (sequenceStage.current === 'footer') {
          if (isFooterClick) {
            clickCount.current += 1;
            if (clickCount.current === 5) {
              sequenceStage.current = 'outside';
              clickCount.current = 0;
            }
          } else {
            // Broken sequence
            sequenceStage.current = 'none';
            clickCount.current = 0;
          }
        } else if (sequenceStage.current === 'outside') {
          if (!isFooterClick) {
            clickCount.current += 1;
            if (clickCount.current === 5) {
              sequenceStage.current = 'none';
              clickCount.current = 0;
              navigate(URL_PATH.ADMIN);
            }
          } else {
            // Restart footer stage if they click footer again during outside stage?
            // Better to just reset or restart footer count.
            sequenceStage.current = 'footer';
            clickCount.current = 1;
          }
        }
      }

      lastClickTime.current = now;
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [navigate, location.pathname, footerRef]);
}
