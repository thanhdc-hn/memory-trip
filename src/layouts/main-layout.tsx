import dayjs from 'dayjs';

import { type FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { useAdminSecret } from '@/hooks/use-admin-secret';

const MainLayout: FC = () => {
  useAdminSecret();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="grow">
        <Outlet />
      </main>
      <footer className="border-t border-gray-100 p-4 text-center text-sm text-gray-500">
        © {dayjs().year()} Memory Trip
      </footer>
      <Toaster />
    </div>
  );
};

export default MainLayout;
