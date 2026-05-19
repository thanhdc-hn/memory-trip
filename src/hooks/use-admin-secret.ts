import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook to navigate to admin page after 10 clicks anywhere on the screen
 */
export function useAdminSecret() {
  const navigate = useNavigate();
  const location = useLocation();
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  useEffect(() => {
    // Reset if we are already on admin page
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const handleClick = () => {
      const now = Date.now();

      // Reset count if more than 3 seconds between clicks (optional, but good for UX)
      if (now - lastClickTime.current > 3000) {
        clickCount.current = 1;
      } else {
        clickCount.current += 1;
      }

      lastClickTime.current = now;

      if (clickCount.current >= 10) {
        clickCount.current = 0; // Reset
        navigate('/admin');
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [navigate, location.pathname]);
}
