import type { PublicTeam } from '@/services/public-team.service';

export function TimelineHeader({ team }: { team: PublicTeam | null }) {
  return (
    <header className="bg-surface/80 border-border/50 safe-top sticky top-0 z-40 w-full border-b-2 px-4 py-4 backdrop-blur-md">
      <div className="mx-auto max-w-2xl space-y-0.5 text-center">
        <h1 className="text-text-h truncate text-xl font-bold">
          {team?.name || 'Loading trip...'}
        </h1>
        <p className="font-handwritten text-text/60 text-sm italic">
          "Our shared scrapbook of memories" ✨
        </p>
      </div>
    </header>
  );
}
