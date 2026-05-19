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
    const { name, invite_password } = JSON.parse(event.body || '{}');

    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name is required' }),
      };
    }

    const { data, error } = await supabase
      .from('teams')
      .insert([{ name, invite_password }])
      .select()
      .single();

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
};
