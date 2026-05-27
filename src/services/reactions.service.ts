import { supabase } from '@/lib/supabase';

export interface PostReaction {
  id: string;
  post_id: string;
  team_id: string;
  user_id: string;
  created_at: string;
}

export interface ReactionStats {
  count: number;
  hasHearted: boolean;
}

export const reactionsService = {
  async getReactionStats(
    postId: string,
    userId: string,
  ): Promise<ReactionStats> {
    const [countResponse, userResponse] = await Promise.all([
      supabase
        .from('post_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId),
      supabase
        .from('post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle(),
    ]);

    if (countResponse.error) throw countResponse.error;
    if (userResponse.error) throw userResponse.error;

    return {
      count: countResponse.count || 0,
      hasHearted: !!userResponse.data,
    };
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
};
