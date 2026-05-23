import type { Handler } from '@netlify/functions';

import {
  errorResponse,
  successResponse,
  supabase,
  validateAdmin,
} from './utils';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const authError = validateAdmin(event);
  if (authError) return authError;

  try {
    const { data, error } = await supabase
      .from('teams')
      .select(
        `
        *,
        posts:posts!left(image_path)
        `,
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    const teams = (data || []).map((team: any) => {
      const postCount = team.posts?.length || 0;
      const imageCount =
        team.posts?.filter((p: any) => !!p.image_path).length || 0;
      return {
        ...team,
        post_count: postCount,
        image_count: imageCount,
      };
    });

    // Remove the raw posts data from the response to keep it clean
    teams.forEach((t: any) => delete t.posts);

    return successResponse(teams);
  } catch (error) {
    return errorResponse(error);
  }
};
