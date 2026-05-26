import { supabase } from '@/lib/supabase';

export interface Post {
  id: string;
  team_id: string;
  author_name: string;
  caption: string | null;
  image_path: string | null;
  created_at: string;
  isFreshUpload?: boolean;
}

export const postsService = {
  async getPosts(teamId: string, page = 0, pageSize = 10): Promise<Post[]> {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data || [];
  },

  async createPost(
    post: Omit<Post, 'id' | 'created_at'> & { id?: string },
  ): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select()
      .single();

    if (error) {
      if (error.code === '42501') {
        throw new Error(
          'You do not have permission to post here. Are you in the right trip?',
        );
      }
      throw error;
    }
    return data;
  },

  subscribeToNewPosts(teamId: string, onEvent: (payload: any) => void) {
    const subscriptionId = Math.random().toString(36).substring(2, 9);
    const channel = supabase
      .channel(`timeline:${teamId}:${subscriptionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          if (payload.new) {
            onEvent(payload);
          }
        },
      )
      .subscribe((status) => {
        console.log(
          `[Realtime] Subscription status for timeline:${teamId}:${subscriptionId}:`,
          status,
        );
      });

    return channel;
  },
};
