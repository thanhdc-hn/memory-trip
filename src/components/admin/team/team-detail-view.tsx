import dayjs from 'dayjs';
import {
  CalendarClock,
  CalendarX,
  Image as ImageIcon,
  Lock,
  MessageSquare,
  RotateCcw,
  Save,
  Settings,
  Shield,
} from 'lucide-react';

import { useEffect, useState } from 'react';

import { StatBadge } from '@/components/admin/ui/admin-ui';
import { ConfirmDialog, DangerZone } from '@/components/admin/ui/danger-zone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTeams } from '@/hooks/use-teams';
import type { Team } from '@/services/team.service';
import { URL_PATH } from '@/utils/constants.ts';

export function TeamDetailView({
  team,
  onClearData,
  onDeleteTeam,
  onLockTimeline,
}: {
  team: Team;
  onBack?: () => void;
  onClearData: () => void;
  onDeleteTeam: () => void;
  onLockTimeline: () => void;
}) {
  const { updateTeam } = useTeams();
  const [name, setName] = useState(team.name);
  const [inviteCode, setInviteCode] = useState(team.invite_code);
  const [password, setPassword] = useState(team.invite_password || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const closeAt = team.close_at ? dayjs(team.close_at) : null;
  const isCloseScheduled = !!closeAt && closeAt.isAfter(dayjs());
  const isClosed = !!closeAt && !closeAt.isAfter(dayjs());

  const handleScheduleClose = () =>
    updateTeam({
      id: team.id,
      input: { close_at: dayjs().add(7, 'day').toISOString() },
    });

  const handleCancelClose = () =>
    updateTeam({
      id: team.id,
      input: { close_at: null, ...(isClosed && { is_locked: false }) },
    });

  useEffect(() => {
    setName(team.name);
    setInviteCode(team.invite_code);
    setPassword(team.invite_password || '');
    setError(null);
  }, [team]);

  const hasChanges =
    name !== team.name ||
    inviteCode !== team.invite_code ||
    (password || undefined) !== (team.invite_password || undefined);

  const handleUpdate = async () => {
    if (!name || !inviteCode) return;
    setIsUpdating(true);
    setError(null);

    const normalizedInviteCode = inviteCode.trim().toLowerCase();

    try {
      await updateTeam({
        id: team.id,
        input: {
          name: name.trim(),
          invite_code: normalizedInviteCode,
          invite_password: password.trim() || null,
        },
      });
    } catch (err: any) {
      if (
        err.message?.includes('duplicate') ||
        err.message?.includes('unique')
      ) {
        setError('This team code already exists 🌙');
      } else {
        setError(err.message || 'Failed to update team');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-6 pb-10 duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{team.name}</div>
            <p className="text-sm text-gray-500">
              Created on {dayjs(team.created_at).format('MM/DD/YYYY')}
            </p>
          </div>
          <StatBadge
            label="Status"
            value={team.is_locked ? 'Locked' : 'Active'}
            color={team.is_locked ? 'destructive' : 'success'}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="flex flex-col items-center justify-center gap-1 p-4 text-center">
              <MessageSquare className="text-primary h-5 w-5" />
              <span className="text-xl font-bold text-gray-900">
                {team.post_count || 0}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Total Posts
              </span>
            </CardContent>
          </Card>
          <Card className="bg-secondary/5 border-secondary/10">
            <CardContent className="flex flex-col items-center justify-center gap-1 p-4 text-center">
              <ImageIcon className="text-secondary h-5 w-5" />
              <span className="text-xl font-bold text-gray-900">
                {team.image_count || 0}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Total Images
              </span>
            </CardContent>
          </Card>
          <Card className="col-span-2 border-yellow-100 bg-yellow-50 sm:col-span-1">
            <CardContent className="flex flex-col items-center justify-center gap-1 p-4 text-center">
              <Settings className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-bold text-gray-900">
                Admin Only
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Access Level
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="px-1 font-bold text-gray-900">Edit Team</div>
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold text-gray-500 uppercase">
                Team Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Team Name"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="ml-1 flex items-center justify-between">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Invite Code
                </label>
                <span className="text-[10px] text-gray-400">
                  {`${URL_PATH.JOIN}/${inviteCode}`}
                </span>
              </div>
              <Input
                value={inviteCode}
                onChange={(e) =>
                  setInviteCode(
                    e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  )
                }
                placeholder="invite-code"
                className="rounded-xl"
              />
              {error && (
                <p className="ml-1 text-xs font-medium text-red-500">{error}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold text-gray-500 uppercase">
                Password (Optional)
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank for no password"
                className="rounded-xl"
              />
            </div>
            <Button
              className="h-11 w-full gap-2 rounded-xl"
              disabled={!hasChanges || isUpdating || !name || !inviteCode}
              onClick={handleUpdate}
            >
              <Save className="h-4 w-4" />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="px-1 font-bold text-gray-900">Quick Actions</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="h-14 justify-start gap-3 rounded-2xl"
            onClick={onLockTimeline}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              {team.is_locked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold">
                {team.is_locked ? 'Unlock Timeline' : 'Lock Timeline'}
              </span>
              <span className="text-[10px] opacity-60">Prevent new posts</span>
            </div>
          </Button>

          {isCloseScheduled ? (
            <Button
              variant="outline"
              className="h-14 justify-start gap-3 rounded-2xl"
              onClick={handleCancelClose}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <CalendarX className="h-4 w-4" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">
                  Cancel scheduled close
                </span>
                <span className="text-[10px] opacity-60">
                  Closes {closeAt!.format('MM/DD/YYYY')}
                </span>
              </div>
            </Button>
          ) : isClosed ? (
            <Button
              variant="outline"
              className="h-14 justify-start gap-3 rounded-2xl"
              onClick={handleCancelClose}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">Reopen Trip</span>
                <span className="text-[10px] opacity-60">
                  Closed — allow posts again
                </span>
              </div>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="h-14 justify-start gap-3 rounded-2xl"
              onClick={() => setShowCloseConfirm(true)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <CalendarClock className="h-4 w-4" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">Close Trip</span>
                <span className="text-[10px] opacity-60">
                  Read-only in 7 days
                </span>
              </div>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="px-1 font-bold text-gray-900">Management</div>
        <DangerZone
          teamName={team.name}
          onClearData={onClearData}
          onDeleteTeam={onDeleteTeam}
        />
      </div>

      <ConfirmDialog
        open={showCloseConfirm}
        onOpenChange={setShowCloseConfirm}
        title="Close Trip?"
        description={`${team.name} will become read-only on ${dayjs().add(7, 'day').format('MM/DD/YYYY')}. Members can still view and export, but posting will be blocked. You can cancel anytime before then.`}
        confirmText="Schedule Close"
        confirmVariant="default"
        onConfirm={handleScheduleClose}
      />
    </div>
  );
}
