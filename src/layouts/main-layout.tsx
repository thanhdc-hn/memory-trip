import dayjs from 'dayjs';

import { type FC, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AmbientEffectLayer } from '@/components/effects/ambient-effect-layer';
import { Toaster } from '@/components/ui/toaster';
import { useAdminSecret } from '@/hooks/use-admin-secret';

/** Routes that show the ambient effect (user-facing experience only). */
const EFFECT_ROUTES = new Set(['/', '/timeline']);

const MainLayout: FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  useAdminSecret(footerRef);
  const { pathname } = useLocation();
  const showEffects = EFFECT_ROUTES.has(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {showEffects && <AmbientEffectLayer />}
      <main className="grow">
        <Outlet />
      </main>
      <footer
        ref={footerRef}
        className="border-t border-gray-100 p-4 text-center text-sm text-gray-500"
      >
        © {dayjs().year()} Memory Trip
      </footer>
      <Toaster />
    </div>
  );
};

export default MainLayout;
