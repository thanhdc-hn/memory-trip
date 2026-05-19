import { type FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { useAdminSecret } from '@/hooks/use-admin-secret';

const MainLayout: FC = () => {
  useAdminSecret();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#16171d]">
      <main className="grow">
        <Outlet />
      </main>
      <footer className="border-t border-gray-100 p-4 text-center text-sm text-gray-500 dark:border-gray-800">
        © {new Date().getFullYear()} Memory Trip
      </footer>
      <Toaster />
    </div>
  );
};

export default MainLayout;
