export interface Team {
  id: string;
  name: string;
  invite_code: string;
  invite_password?: string;
  is_locked: boolean;
  created_at: string;
  post_count?: number;
}

export type CreateTeamInput = {
  name: string;
  invite_code: string;
  invite_password?: string;
};

export type UpdateTeamInput = {
  name?: string;
  invite_code?: string;
  invite_password?: string;
  is_locked?: boolean;
};

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('admin_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    'x-admin-auth': token || '',
    ...options.headers,
  };

  const response = await fetch(`/.netlify/functions/${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'API request failed');
  }

  return result.data;
}

export const teamService = {
  async getTeams(): Promise<Team[]> {
    return apiFetch<Team[]>('admin-teams-list');
  },

  async createTeam(input: CreateTeamInput): Promise<Team> {
    return apiFetch<Team>('admin-teams-create', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateTeam(id: string, input: UpdateTeamInput): Promise<Team> {
    return apiFetch<Team>('admin-teams-update', {
      method: 'POST',
      body: JSON.stringify({ id, ...input }),
    });
  },

  async deleteTeam(id: string): Promise<void> {
    await apiFetch('admin-teams-delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  async toggleTeamLock(id: string, isLocked: boolean): Promise<Team> {
    return this.updateTeam(id, { is_locked: isLocked });
  },

  async getStorageUsage(): Promise<{ total_size: number }> {
    return apiFetch('admin-storage');
  },
};
