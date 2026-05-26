import dayjs from 'dayjs';
import {
  Calendar,
  Copy,
  Image as ImageIcon,
  Lock,
  MessageSquare,
  QrCode,
  Unlock,
} from 'lucide-react';

import { type MouseEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import type { Team } from '@/services/team.service';
import { URL_PATH } from '@/utils/constants.ts';

export type { Team };

export function TeamCard({
  team,
  onToggleLock,
  onQRGenerate,
  onClick,
}: {
  team: Team;
  onToggleLock: (id: string) => void;
  onClick: (id: string) => void;
  onQRGenerate: (id: string) => void;
}) {
  const copyInviteLink = (e: MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}${URL_PATH.JOIN}/${team.invite_code}`;
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
        <div className="mb-4 items-start justify-between">
          <div className="space-y-1">
            <div className="group-hover:text-primary flex text-lg font-bold text-gray-900 transition-colors">
              <div className="flex-1">{team.name}</div>
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <Calendar className="h-3 w-3" />
                {dayjs(team.created_at).format('MM/DD/YYYY')}
              </div>
              {team.invite_password && (
                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                  <Lock className="h-2.5 w-2.5" />
                  Protected
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-gray-50 p-3">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">
              {team.post_count || 0}
            </span>
            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              Posts
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-gray-50 p-3">
            <ImageIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">
              {team.image_count || 0}
            </span>
            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              Images
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
                onQRGenerate(team.id);
              }}
              title={'Generate QR Invite'}
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
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
