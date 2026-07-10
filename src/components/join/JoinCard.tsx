import { type ReactNode } from 'react';

import { Tape } from '@/components/animation/animation-utils';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function JoinCard({
  children,
  className,
  withTape = true,
  rotation = 1,
}: {
  children: ReactNode;
  className?: string;
  withTape?: boolean;
  rotation?: number;
}) {
  return (
    <Card
      variant="polaroid"
      className={cn('relative overflow-visible pt-8', className)}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {withTape && <Tape rotation={-2} />}
      <CardContent className="flex flex-col items-center gap-6 text-center">
        {children}
      </CardContent>
    </Card>
  );
}
