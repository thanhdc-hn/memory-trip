import React from 'react';
import { Outlet } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#16171d]">
      <header className="border-b border-gray-100 p-4 dark:border-gray-800">
        <nav className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#aa3bff]">Memory Trip</span>
        </nav>
      </header>
      <main className="flex-grow">
        <Outlet/>
      </main>
      <footer className="border-t border-gray-100 p-4 text-center text-sm text-gray-500 dark:border-gray-800">
        © {new Date().getFullYear()} Memory Trip
      </footer>
      <Toaster/>
    </div>
  );
};

export default MainLayout;
