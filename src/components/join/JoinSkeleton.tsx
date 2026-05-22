import { JoinCard } from './JoinCard';

export function JoinSkeleton() {
  return (
    <JoinCard className="pointer-events-none animate-pulse" rotation={0}>
      <div className="bg-sand/30 h-10 w-48 rounded-lg" />
      <div className="bg-sand/20 h-6 w-64 rounded-lg" />
      <div className="bg-sand/20 my-4 h-32 w-32 rounded-full" />

      <div className="w-full space-y-4">
        <div className="space-y-2">
          <div className="bg-sand/20 h-4 w-32 rounded-md" />
          <div className="bg-sand/10 h-12 w-full rounded-2xl" />
        </div>
        <div className="bg-sand/30 mt-8 h-16 w-full rounded-2xl" />
      </div>
    </JoinCard>
  );
}
