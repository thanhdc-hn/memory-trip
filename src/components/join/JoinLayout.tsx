import { type ReactNode } from 'react';

import { AppLayout } from '@/components/layout/layout-primitives';

export function JoinLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout>
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </AppLayout>
  );
}
