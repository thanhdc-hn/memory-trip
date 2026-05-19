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
    const { id, name, invite_password, is_locked } = JSON.parse(
      event.body || '{}',
    );

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'ID is required' }),
      };
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (invite_password !== undefined)
      updates.invite_password = invite_password;
    if (is_locked !== undefined) updates.is_locked = is_locked;

    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
};
