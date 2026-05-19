import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function AppLayout({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="bg-surface selection:bg-primary/30 flex min-h-screen flex-col items-center">
      <div className="flex w-full max-w-4xl flex-col gap-12 px-4 py-8 md:py-12">
        {header}
        <main className="flex-1">{children}</main>
        {footer}
      </div>
    </div>
  );
}

export function MasonryGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CenteredContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('flex flex-col items-center gap-6 text-center', className)}
    >
      {children}
    </div>
  );
}
