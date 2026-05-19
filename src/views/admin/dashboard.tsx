import { HardDrive, Plus, Search } from 'lucide-react';

import { useEffect, useState } from 'react';

import { AdminAuthModal } from '@/components/admin/auth/admin-auth-modal';
import {
  AdminHeader,
  AdminLayout,
} from '@/components/admin/layout/admin-layout';
import { CreateTeamSheet } from '@/components/admin/team/create-team-sheet';
import { TeamCard } from '@/components/admin/team/team-card';
import { TeamDetailView } from '@/components/admin/team/team-detail-view';
import { EmptyState, LoadingSkeleton } from '@/components/admin/ui/admin-ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useTeams } from '@/hooks/use-teams';
import { toast } from '@/hooks/use-toast.ts';
import { teamService } from '@/services/team.service';

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, login, logout, checkAuth } =
    useAdminAuth();
  const { teams, createTeam, deleteTeam, toggleTeamLock } = useTeams();

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageSize, setStorageSize] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    teamService
      .getStorageUsage()
      .then((d) => setStorageSize(d.total_size))
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInterval = setInterval(() => {
      checkAuth();
    }, 10000); // check session every 10s

    return () => {
      clearInterval(checkInterval);
    };
  }, [isAuthenticated, checkAuth]);

  if (isAuthenticated === null || isLoading) return null; // Initial check

  if (!isAuthenticated) {
    return <AdminAuthModal onLogin={login} />;
  }

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  const filteredTeams = teams
    .filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const handleCreateTeam = async (data: {
    name: string;
    password?: string;
  }) => {
    await createTeam({ name: data.name, invite_password: data.password });
  };

  const handleToggleLock = async (id: string) => {
    const team = teams.find((t) => t.id === id);
    if (team) {
      await toggleTeamLock(id, !team.is_locked);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    await deleteTeam(id);
    setSelectedTeamId(null);
  };

  const handleClearData = (id: string) => {
    // This could be implemented in teamService if needed
    console.log('Clear data for team:', id);
    toast({ title: 'Data Cleared', description: 'Posts and images removed.' });
  };

  return (
    <AdminLayout
      header={
        <div className="flex flex-col">
          <AdminHeader
            title={selectedTeam ? selectedTeam.name : 'Admin Dashboard'}
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
            <CardContent className="flex items-center gap-4 p-4">
              <div className="bg-primary/20 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                <HardDrive className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-end justify-between">
                  <span className="text-primary/70 text-xs font-bold tracking-wider uppercase">
                    Storage Usage
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    {storageSize !== null
                      ? `${(storageSize / 1024 / 1024 / 1024).toFixed(2)} GB`
                      : '...'}{' '}
                    / 5 GB
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{
                      width: `${storageSize !== null ? Math.min((storageSize / (5 * 1024 * 1024 * 1024)) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teams Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-gray-900">Teams</div>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="h-10 gap-2 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                New Team
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search teams..."
                className="focus-visible:ring-primary/30 rounded-xl border-none bg-gray-50 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Teams List */}
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <LoadingSkeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="grid gap-4">
              {filteredTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onClick={(id) => setSelectedTeamId(id)}
                  onToggleLock={handleToggleLock}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No teams found"
              description={
                searchQuery
                  ? 'Try a different search term.'
                  : 'Get started by creating your first team.'
              }
              icon={Search}
              action={
                !searchQuery && (
                  <Button
                    onClick={() => setIsCreateOpen(true)}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Create Team
                  </Button>
                )
              }
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
  );
}
