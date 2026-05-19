import { type MouseEvent } from "react"
import {
  Lock,
  Unlock,
  Key,
  Trash2,
  Copy,
  Calendar,
  Image as ImageIcon,
  MessageSquare
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import type { Team } from "@/services/team.service"

export type { Team }

export function TeamCard({
                           team,
                           onToggleLock,
                           onResetPassword,
                           onDelete,
                           onClick
                         }: {
  team: Team
  onToggleLock: (id: string) => void
  onResetPassword: (id: string) => void
  onDelete: (id: string) => void
  onClick: (id: string) => void
}) {
  const copyInviteLink = (e: MouseEvent) => {
    e.stopPropagation()
    const link = `${window.location.origin}/join/${team.id}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link Copied!",
      description: "Invite link copied to clipboard.",
    })
  }

  return (
    <Card
      className="group overflow-hidden hover:border-primary/50 cursor-pointer transition-all active:scale-[0.98]"
      onClick={() => onClick(team.id)}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
              {team.name}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Calendar className="w-3 h-3"/>
              {new Date(team.created_at).toLocaleDateString()}
            </div>
          </div>
          <Badge variant={team.is_locked ? "destructive" : "secondary"} className="gap-1">
            {team.is_locked ? <Lock className="w-3 h-3"/> : <Unlock className="w-3 h-3"/>}
            {team.is_locked ? "Locked" : "Active"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
            <MessageSquare className="w-4 h-4 text-gray-400"/>
            <span className="text-sm font-bold text-gray-700">{team.post_count || 0}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Posts</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
            <ImageIcon className="w-4 h-4 text-gray-400"/>
            <span className="text-sm font-bold text-gray-700">{Math.floor((team.post_count || 0) * 1.5)}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Images</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl h-9 text-xs font-bold gap-1.5"
            onClick={copyInviteLink}
          >
            <Copy className="w-3.5 h-3.5"/>
            Copy Link
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-9 w-9 text-gray-400 hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock(team.id);
              }}
              title={team.is_locked ? "Unlock" : "Lock"}
            >
              {team.is_locked ? <Unlock className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-9 w-9 text-gray-400 hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onResetPassword(team.id);
              }}
              title="Reset Password"
            >
              <Key className="w-4 h-4"/>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(team.id);
              }}
              title="Delete Team"
            >
              <Trash2 className="w-4 h-4"/>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
