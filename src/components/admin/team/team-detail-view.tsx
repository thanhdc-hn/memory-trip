import {
  Download,
  Image as ImageIcon,
  Lock,
  MessageSquare,
  Settings,
  Shield,
} from 'lucide-react';

import { StatBadge } from '@/components/admin/ui/admin-ui';
import { DangerZone } from '@/components/admin/ui/danger-zone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Team } from '@/services/team.service';

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
  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{team.name}</div>
            <p className="text-sm text-gray-500">
              Created on {new Date(team.created_at).toLocaleDateString()}
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
                {Math.floor((team.post_count || 0) * 1.5)}
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
          <Button
            variant="outline"
            className="h-14 cursor-not-allowed justify-start gap-3 rounded-2xl opacity-50"
            disabled
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <Download className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold">Export PDF</span>
              <span className="text-[10px] opacity-60">Coming soon...</span>
            </div>
          </Button>
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
    </div>
  );
}
