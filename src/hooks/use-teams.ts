import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/hooks/use-toast';
import {
  type CreateTeamInput,
  type Team,
  type UpdateTeamInput,
  teamService,
} from '@/services/team.service';

export function useTeams() {
  const queryClient = useQueryClient();

  const {
    data: teams = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['teams', localStorage.getItem('admin_auth_token')],
    queryFn: () => teamService.getTeams(),
    throwOnError: (err: any) => err.message === 'Unauthorized',
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateTeamInput) => teamService.createTeam(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: 'Team Created',
        description: 'New team has been successfully created.',
      });
    },
    onError: (err: any) => {
      if (err.message?.includes('teams_invite_code_key')) {
        return;
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to create team.',
        variant: 'destructive',
      });
    },
    throwOnError: (err: any) => err.message === 'Unauthorized',
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTeamInput }) =>
      teamService.updateTeam(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData<Team[]>(['teams']);

      if (previousTeams) {
        queryClient.setQueryData<Team[]>(
          ['teams'],
          previousTeams.map((t) => (t.id === id ? { ...t, ...input } : t)),
        );
      }

      return { previousTeams };
    },
    onError: (err: any, _, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(['teams'], context.previousTeams);
      }
      if (err.message?.includes('teams_invite_code_key')) {
        return;
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to update team.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onSuccess: () => {
      toast({
        title: 'Team Updated',
        description: 'Team has been successfully updated.',
      });
    },
    throwOnError: (err: any) => err.message === 'Unauthorized',
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teamService.deleteTeam(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData<Team[]>(['teams']);

      if (previousTeams) {
        queryClient.setQueryData<Team[]>(
          ['teams'],
          previousTeams.filter((t) => t.id !== id),
        );
      }

      return { previousTeams };
    },
    onError: (err: any, _, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(['teams'], context.previousTeams);
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete team.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onSuccess: () => {
      toast({
        title: 'Team Deleted',
        description: 'Team has been successfully deleted.',
      });
    },
    throwOnError: (err: any) => err.message === 'Unauthorized',
  });

  const toggleLockMutation = useMutation({
    mutationFn: ({ id, isLocked }: { id: string; isLocked: boolean }) =>
      teamService.toggleTeamLock(id, isLocked),
    onMutate: async ({ id, isLocked }) => {
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData<Team[]>(['teams']);

      if (previousTeams) {
        queryClient.setQueryData<Team[]>(
          ['teams'],
          previousTeams.map((t) =>
            t.id === id ? { ...t, is_locked: isLocked } : t,
          ),
        );
      }

      return { previousTeams };
    },
    onError: (err: any, _, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(['teams'], context.previousTeams);
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to toggle lock.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onSuccess: (data) => {
      toast({
        title: data.is_locked ? 'Team Locked' : 'Team Unlocked',
        description: `Team has been ${data.is_locked ? 'locked' : 'unlocked'}.`,
      });
    },
    throwOnError: (err: any) => err.message === 'Unauthorized',
  });

  return {
    teams,
    loading,
    error,
    createTeam: createMutation.mutateAsync,
    updateTeam: updateMutation.mutateAsync,
    deleteTeam: deleteMutation.mutateAsync,
    toggleTeamLock: (id: string, isLocked: boolean) =>
      toggleLockMutation.mutateAsync({ id, isLocked }),
    refetch,
  };
}
