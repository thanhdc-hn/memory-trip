import { supabase } from '@/lib/supabase';

export interface PostReaction {
  id: string;
  post_id: string;
  team_id: string;
  user_id: string;
  created_at: string;
}

export const reactionsService = {
  async getReactionsForTeam(teamId: string): Promise<PostReaction[]> {
    const { data, error } = await supabase
      .from('post_reactions')
      .select('*')
      .eq('team_id', teamId);

    if (error) throw error;
    return data || [];
  },

  async addReaction(
    postId: string,
    teamId: string,
    userId: string,
  ): Promise<PostReaction> {
    const { data, error } = await supabase
      .from('post_reactions')
      .insert([
        {
          post_id: postId,
          team_id: teamId,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeReaction(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('post_reactions')
      .delete()
      .match({ post_id: postId, user_id: userId });

    if (error) throw error;
  },

  subscribeToReactions(teamId: string, onEvent: (payload: any) => void) {
    const subscriptionId = Math.random().toString(36).substring(2, 9);
    const channel = supabase
      .channel(`reactions:${teamId}:${subscriptionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_reactions',
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          onEvent(payload);
        },
      )
      .subscribe();

    return channel;
  },
};
