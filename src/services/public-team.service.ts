import { supabase } from '@/lib/supabase';

export interface PublicTeam {
  id: string;
  name: string;
  is_locked: boolean;
  has_password: boolean;
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

  async verifyPassword(teamId: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('verify_team_password', {
      p_team_id: teamId,
      p_password: password,
    });

    if (error) throw error;
    return !!data;
  },
};
