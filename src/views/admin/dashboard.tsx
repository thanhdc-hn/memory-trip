import { useState, useEffect } from "react"
import { Plus, Search, HardDrive, Clock } from "lucide-react"
import { AdminLayout, AdminHeader } from "@/components/admin/layout/admin-layout"
import { AdminAuthModal } from "@/components/admin/auth/admin-auth-modal"
import { TeamCard, type Team } from "@/components/admin/team/team-card"
import { TeamDetailView } from "@/components/admin/team/team-detail-view"
import { CreateTeamSheet } from "@/components/admin/team/create-team-sheet"
import { EmptyState, LoadingSkeleton } from "@/components/admin/ui/admin-ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { toast } from "@/hooks/use-toast"

// Mock data for initial implementation
const MOCK_TEAMS: Team[] = [
  { id: "1", name: "Family Vacation 2024", created_at: "2024-05-01", is_locked: false, post_count: 24 },
  { id: "2", name: "Road Trip to Alps", created_at: "2024-04-15", is_locked: true, post_count: 56 },
  { id: "3", name: "Beach Weekend", created_at: "2024-05-10", is_locked: false, post_count: 8 },
]

export default function AdminDashboard() {
  const { isAuthenticated, login, logout, getTimeRemaining } = useAdminAuth()
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [warned, setWarned] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      const remaining = getTimeRemaining()
      setTimeLeft(remaining)

      // Auto logout warning 1 min before expire
      if (remaining > 0 && remaining < 60000 && !warned) {
        toast({
          title: "Session Expiring",
          description: "You will be logged out in less than a minute.",
        })
        setWarned(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, getTimeRemaining, warned])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isAuthenticated === null) return null // Initial check

  if (!isAuthenticated) {
    return <AdminAuthModal onLogin={login}/>
  }

  const selectedTeam = teams.find(t => t.id === selectedTeamId)

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const handleCreateTeam = (data: { name: string }) => {
    const newTeam: Team = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      created_at: new Date().toISOString(),
      is_locked: false,
      post_count: 0
    }
    setTeams([newTeam, ...teams])
    toast({ title: "Team Created!", description: `${data.name} is ready.` })
  }

  const handleToggleLock = (id: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, is_locked: !t.is_locked } : t))
    const team = teams.find(t => t.id === id)
    toast({
      title: team?.is_locked ? "Team Unlocked" : "Team Locked",
      description: `${team?.name} status updated.`
    })
  }

  const handleDeleteTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id))
    setSelectedTeamId(null)
    toast({ variant: "destructive", title: "Team Deleted", description: "All data has been removed." })
  }

  const handleClearData = (id: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, post_count: 0 } : t))
    toast({ title: "Data Cleared", description: "Posts and images removed." })
  }

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000)
    const secs = Math.floor((ms % 60000) / 1000)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AdminLayout
      header={
        <div className="flex flex-col">
          <AdminHeader
            title={selectedTeam ? selectedTeam.name : "Admin Dashboard"}
            onBack={selectedTeam ? () => setSelectedTeamId(null) : undefined}
            onLogout={logout}
          />
          {isAuthenticated && (
            <div className="bg-primary/5 px-4 py-1.5 flex justify-center items-center gap-2 border-b border-gray-100">
              <Clock className="w-3.5 h-3.5 text-primary"/>
              <span
                className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Session expires in {formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      }
    >
      {selectedTeam ? (
        <TeamDetailView
          team={selectedTeam}
          onBack={() => setSelectedTeamId(null)}
          onClearData={() => handleClearData(selectedTeam.id)}
          onDeleteTeam={() => handleDeleteTeam(selectedTeam.id)}
          onLockTimeline={() => handleToggleLock(selectedTeam.id)}
        />
      ) : (
        <div className="space-y-6">
          {/* Storage Overview */}
          <Card className="bg-primary/5 border-primary/10 overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <HardDrive className="w-6 h-6"/>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-bold text-primary/70 uppercase tracking-wider">Storage Usage</span>
                  <span className="text-xs font-bold text-gray-500">1.2 GB / 5 GB</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[24%]"/>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teams Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-gray-900">Teams</div>
              <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl h-10 gap-2">
                <Plus className="w-4 h-4"/>
                New Team
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
              <Input
                placeholder="Search teams..."
                className="pl-10 rounded-xl bg-gray-50 border-none focus-visible:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Teams List */}
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => <LoadingSkeleton key={i} className="h-48 w-full"/>)}
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="grid gap-4">
              {filteredTeams.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onClick={(id) => setSelectedTeamId(id)}
                  onToggleLock={handleToggleLock}
                  onDelete={handleDeleteTeam}
                  onResetPassword={() => toast({
                    title: "Password Reset",
                    description: "Invite password has been updated."
                  })}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No teams found"
              description={searchQuery ? "Try a different search term." : "Get started by creating your first team."}
              icon={Search}
              action={!searchQuery && (
                <Button onClick={() => setIsCreateOpen(true)} variant="outline" className="rounded-xl">
                  Create Team
                </Button>
              )}
            />
          )}
        </div>
      )}

      <CreateTeamSheet
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={handleCreateTeam}
      />
    </AdminLayout>
  )
}
