import { Download, LogOut, MoreVertical, Share2 } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ShareTeamModal } from '@/components/share/share-team-modal';
import { Button } from '@/components/ui/button';
import { useTeamStats } from '@/hooks/use-team-stats';
import type { PublicTeam } from '@/services/public-team.service';
import { URL_PATH } from '@/utils/constants';

import { QuitTeamDialog } from './QuitTeamDialog';
import { TripStatsStrip } from './TripStatsStrip';

export function TimelineHeader({ team }: { team: PublicTeam | null }) {
  const navigate = useNavigate();
  const { t } = useTranslation('timeline');
  const stats = useTeamStats(team?.id || null);
  const [showShare, setShowShare] = useState(false);
  const [showQuit, setShowQuit] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  return (
    <header className="bg-surface/80 border-border/50 safe-top sticky top-0 z-40 w-full border-b-2 px-4 pt-8 pb-2 backdrop-blur-md">
      <div className="absolute top-1 right-2 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-text/60 hover:bg-primary/10 hover:text-primary transition-colors"
          disabled={!team}
          onClick={() => setShowShare(true)}
        >
          <Share2 className="h-5 w-5" />
          <span className="sr-only">{t('shareTeam')}</span>
        </Button>

        <div ref={menuRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-text/60 hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">{t('moreOptions')}</span>
          </Button>

          {menuOpen && (
            <div className="bg-surface border-border/50 animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-1 w-52 overflow-hidden rounded-xl border-2 py-1 shadow-lg">
              <button
                disabled={!team}
                onClick={() => {
                  setMenuOpen(false);
                  navigate(URL_PATH.EXPORT);
                }}
                className="text-text/80 hover:bg-primary/10 hover:text-primary flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                {t('exportMemories')}
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowQuit(true);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" />
                {t('quitTeam')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-0.5 text-center">
        <div className="text-text-h text-2xl font-bold">
          {team?.name || t('loadingTrip')}
        </div>
        <p className="font-handwritten text-text/60 text-sm italic">
          {t('headerTagline')}
        </p>
        <TripStatsStrip stats={stats} />
      </div>

      <ShareTeamModal
        team={team}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
      <QuitTeamDialog open={showQuit} onOpenChange={setShowQuit} />
    </header>
  );
}
