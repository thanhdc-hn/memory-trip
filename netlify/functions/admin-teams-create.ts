import type { Handler } from '@netlify/functions';

import {
  errorResponse,
  successResponse,
  supabase,
  validateAdmin,
} from './utils';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const authError = validateAdmin(event);
  if (authError) return authError;

  try {
    const { name, invite_code, invite_password, post_limit } = JSON.parse(
      event.body || '{}',
    );

    const password = invite_password?.trim() || null;

    if (!name || !invite_code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and Invite Code are required' }),
      };
    }

    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          name,
          invite_code,
          invite_password: password,
          post_limit: post_limit ?? null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
};
