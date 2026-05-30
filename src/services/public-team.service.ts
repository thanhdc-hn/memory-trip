import { supabase } from '@/lib/supabase';

export interface PublicTeam {
  id: string;
  name: string;
  invite_code: string;
  is_locked: boolean;
  has_password: boolean;
}

export interface TeamStats {
  memory_count: number;
  member_count: number;
  first_memory_at: string | null;
  last_memory_at: string | null;
}

export const publicTeamService = {
  async getTeam(id: string): Promise<PublicTeam | null> {
    const { data, error } = await supabase
      .from('public_team_preview')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data as PublicTeam;
  },

  async getTeamByInviteCode(code: string): Promise<PublicTeam | null> {
    const { data, error } = await supabase
      .from('public_team_preview')
      .select('*')
      .eq('invite_code', code.toLowerCase().trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data as PublicTeam;
  },

  async verifyPassword(teamId: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('verify_team_password', {
      p_team_id: teamId,
      p_password: password,
    });

    if (error) throw error;
    return !!data;
  },

  async getTeamStats(teamId: string): Promise<TeamStats> {
    const { data, error } = await supabase.rpc('get_team_stats', {
      p_team_id: teamId,
    });

    if (error) throw error;
    return data as TeamStats;
  },
};
