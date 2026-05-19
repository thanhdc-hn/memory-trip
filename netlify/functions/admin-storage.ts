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
    const { data, error } = await supabase.rpc('get_storage_usage');

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
};
