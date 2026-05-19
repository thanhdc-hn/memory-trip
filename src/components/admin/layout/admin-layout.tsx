import { ArrowLeft, LogOut, Shield } from 'lucide-react';

import { type ReactNode } from 'react';

import { Button } from '@/components/ui/button';

export function AdminHeader({
  title,
  onBack,
  onLogout,
}: {
  title: string;
  onBack?: () => void;
  onLogout?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {onBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Shield className="text-primary h-5 w-5" />
            </div>
          )}
          <div className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {title}
          </div>
        </div>
        {onLogout && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="rounded-full text-gray-500 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}

export function AdminLayout({
  children,
  header,
}: {
  children: ReactNode;
  header?: ReactNode;
}) {
  return (
    <div className="selection:bg-primary/20 flex min-h-screen flex-col items-center bg-gray-50">
      <div className="flex min-h-screen w-full max-w-3xl flex-col bg-white shadow-sm">
        {header}
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <div className="h-24" aria-hidden="true" />
        {/* Bottom Safe Space */}
      </div>
    </div>
  );
}
