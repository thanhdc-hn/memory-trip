import { supabase } from '@/lib/supabase';

export interface Post {
  id: string;
  team_id: string;
  author_name: string;
  caption: string | null;
  image_path: string | null;
  created_at: string;
}

export const postsService = {
  async getPosts(teamId: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  subscribeToNewPosts(teamId: string, onNewPost: (post: Post) => void) {
    return supabase
      .channel(`public:posts:team_id=eq.${teamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          onNewPost(payload.new as Post);
        },
      )
      .subscribe();
  },
};
