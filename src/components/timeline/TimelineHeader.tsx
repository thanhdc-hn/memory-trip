import type { PublicTeam } from '@/services/public-team.service';

import { QuitTeamDialog } from './QuitTeamDialog';

export function TimelineHeader({ team }: { team: PublicTeam | null }) {
  return (
    <header className="bg-surface/80 border-border/50 safe-top sticky top-0 z-40 w-full border-b-2 px-4 py-4 backdrop-blur-md">
      <div className="absolute top-1 right-2">
        <QuitTeamDialog />
      </div>
      <div className="mx-auto max-w-2xl space-y-0.5 text-center">
        <div className="text-text-h truncate text-4xl font-bold">
          {team?.name || 'Loading trip...'}
        </div>
        <p className="font-handwritten text-text/60 text-sm italic">
          "Our shared scrapbook of memories" ✨
        </p>
      </div>
    </header>
  );
}
