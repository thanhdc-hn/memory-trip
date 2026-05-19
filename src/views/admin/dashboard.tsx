import { useState, useEffect } from "react"
import { Plus, Search, HardDrive } from "lucide-react"
import { AdminLayout, AdminHeader } from "@/components/admin/layout/admin-layout"
import { AdminAuthModal } from "@/components/admin/auth/admin-auth-modal"
import { TeamCard } from "@/components/admin/team/team-card"
import { TeamDetailView } from "@/components/admin/team/team-detail-view"
import { CreateTeamSheet } from "@/components/admin/team/create-team-sheet"
import { EmptyState, LoadingSkeleton } from "@/components/admin/ui/admin-ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { useTeams } from "@/hooks/use-teams"
import { teamService } from "@/services/team.service"
import { toast } from '@/hooks/use-toast.ts';

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, login, logout, checkAuth } = useAdminAuth()
  const { 
    teams,
    createTeam, 
    updateTeam,
    deleteTeam, 
    toggleTeamLock 
  } = useTeams()
  
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [storageSize, setStorageSize] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return
    teamService.getStorageUsage().then(d => setStorageSize(d.total_size)).catch(() => {})
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return

    const checkInterval = setInterval(() => {
      checkAuth()
    }, 10000) // check session every 10s

    return () => {
      clearInterval(checkInterval)
    }
  }, [isAuthenticated, checkAuth])


  if (isAuthenticated === null || isLoading) return null // Initial check

  if (!isAuthenticated) {
    return <AdminAuthModal onLogin={login}/>
  }

  const selectedTeam = teams.find(t => t.id === selectedTeamId)

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const handleCreateTeam = async (data: { name: string, password?: string }) => {
    await createTeam({ name: data.name, invite_password: data.password })
  }

  const handleResetPassword = async (id: string) => {
    const newPassword = Math.random().toString(36).slice(-8)
    await updateTeam({ id, input: { invite_password: newPassword } })
    toast({
      title: "Password Reset",
      description: `New password: ${newPassword}`,
    })
  }

  const handleToggleLock = async (id: string) => {
    const team = teams.find(t => t.id === id)
    if (team) {
      await toggleTeamLock(id, !team.is_locked)
    }
  }

  const handleDeleteTeam = async (id: string) => {
    await deleteTeam(id)
    setSelectedTeamId(null)
  }

  const handleClearData = (id: string) => {
    // This could be implemented in teamService if needed
    console.log("Clear data for team:", id)
    toast({ title: "Data Cleared", description: "Posts and images removed." })
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
                  <span className="text-xs font-bold text-gray-500">
                    {storageSize !== null ? `${(storageSize / 1024 / 1024 / 1024).toFixed(2)} GB` : '...'} / 5 GB
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${storageSize !== null ? Math.min((storageSize / (5 * 1024 * 1024 * 1024)) * 100, 100) : 0}%` }}
                  />
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
                  onResetPassword={handleResetPassword}
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
