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
      .select('*, posts(count)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const teams = (data || []).map((team: any) => ({
      ...team,
      post_count: team.posts?.[0]?.count || 0,
    }));

    return successResponse(teams);
  } catch (error) {
    return errorResponse(error);
  }
};
