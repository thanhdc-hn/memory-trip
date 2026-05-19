import { Calendar, Copy, Lock, MessageSquare, Unlock } from 'lucide-react';

import { type MouseEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import type { Team } from '@/services/team.service';

export type { Team };

export function TeamCard({
  team,
  onToggleLock,

  onClick,
}: {
  team: Team;
  onToggleLock: (id: string) => void;
  onClick: (id: string) => void;
}) {
  const copyInviteLink = (e: MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/join/${team.id}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link Copied!',
      description: 'Invite link copied to clipboard.',
    });
  };

  return (
    <Card
      className="group hover:border-primary/50 cursor-pointer overflow-hidden transition-all active:scale-[0.98]"
      onClick={() => onClick(team.id)}
    >
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-1">
            <div className="group-hover:text-primary text-lg font-bold text-gray-900 transition-colors">
              {team.name}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <Calendar className="h-3 w-3" />
              {new Date(team.created_at).toLocaleDateString()}
            </div>
          </div>
          <Badge
            variant={team.is_locked ? 'destructive' : 'secondary'}
            className="gap-1"
          >
            {team.is_locked ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
            {team.is_locked ? 'Locked' : 'Active'}
          </Badge>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3">
          <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-gray-50 p-3">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">
              {team.post_count || 0}
            </span>
            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              Posts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 flex-1 gap-1.5 rounded-xl text-xs font-bold"
            onClick={copyInviteLink}
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Link
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="hover:text-primary h-9 w-9 rounded-xl text-gray-400"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock(team.id);
              }}
              title={team.is_locked ? 'Unlock' : 'Lock'}
            >
              {team.is_locked ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
