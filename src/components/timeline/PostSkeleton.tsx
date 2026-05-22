import { Card } from '@/components/ui/card';

export function PostSkeleton() {
  return (
    <Card className="border-border shadow-soft space-y-3 overflow-hidden rounded-3xl border-2 p-4">
      <div className="flex items-center justify-between">
        <div className="bg-sand/20 h-6 w-24 animate-pulse rounded-full" />
        <div className="bg-sand/20 h-3 w-16 animate-pulse rounded" />
      </div>
      <div className="bg-sand/20 aspect-square w-full animate-pulse rounded-2xl" />
      <div className="space-y-2 px-2">
        <div className="bg-sand/20 h-4 w-full animate-pulse rounded" />
        <div className="bg-sand/20 h-4 w-2/3 animate-pulse rounded" />
      </div>
    </Card>
  );
}
