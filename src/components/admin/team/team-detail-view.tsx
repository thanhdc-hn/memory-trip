import {
  Shield,
  Settings,
  MessageSquare,
  Image as ImageIcon,
  Lock,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatBadge } from "@/components/admin/ui/admin-ui"
import { DangerZone } from "@/components/admin/ui/danger-zone"
import type { Team } from "@/services/team.service"

export function TeamDetailView({
                                 team,
                                 onClearData,
                                 onDeleteTeam,
                                 onLockTimeline
                               }: {
  team: Team
  onBack?: () => void
  onClearData: () => void
  onDeleteTeam: () => void
  onLockTimeline: () => void
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{team.name}</div>
            <p className="text-sm text-gray-500">Created on {new Date(team.created_at).toLocaleDateString()}</p>
          </div>
          <StatBadge label="Status" value={team.is_locked ? "Locked" : "Active"}
                     color={team.is_locked ? "destructive" : "success"}/>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
              <MessageSquare className="w-5 h-5 text-primary"/>
              <span className="text-xl font-bold text-gray-900">{team.post_count || 0}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Total Posts</span>
            </CardContent>
          </Card>
          <Card className="bg-secondary/5 border-secondary/10">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
              <ImageIcon className="w-5 h-5 text-secondary"/>
              <span className="text-xl font-bold text-gray-900">{Math.floor((team.post_count || 0) * 1.5)}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Total Images</span>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-100 col-span-2 sm:col-span-1">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
              <Settings className="w-5 h-5 text-yellow-600"/>
              <span className="text-sm font-bold text-gray-900">Admin Only</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Access Level</span>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="font-bold text-gray-900 px-1">Quick Actions</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-14 justify-start gap-3 rounded-2xl"
            onClick={onLockTimeline}
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              {team.is_locked ? <Lock className="w-4 h-4"/> : <Shield className="w-4 h-4"/>}
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-sm">{team.is_locked ? "Unlock Timeline" : "Lock Timeline"}</span>
              <span className="text-[10px] opacity-60">Prevent new posts</span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-14 justify-start gap-3 rounded-2xl opacity-50 cursor-not-allowed"
            disabled
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Download className="w-4 h-4"/>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-sm">Export PDF</span>
              <span className="text-[10px] opacity-60">Coming soon...</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="font-bold text-gray-900 px-1">Management</div>
        <DangerZone
          teamName={team.name}
          onClearData={onClearData}
          onDeleteTeam={onDeleteTeam}
        />
      </div>
    </div>
  )
}
