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
    const { id } = JSON.parse(event.body || '{}');

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Team ID is required' }),
      };
    }

    // 1. Get all posts to find image paths
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('image_path')
      .eq('team_id', id);

    if (fetchError) throw fetchError;

    // 2. Delete images from storage if any
    const imagePaths = posts
      ?.map((p) => p.image_path)
      .filter((path): path is string => !!path);

    if (imagePaths && imagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('memory-images')
        .remove(imagePaths);

      if (storageError) {
        console.error('Error deleting images from storage:', storageError);
        // We continue anyway to clear the database records
      }
    }

    // 3. Delete posts from database
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('team_id', id);

    if (deleteError) throw deleteError;

    return successResponse({ cleared: id, postsDeleted: posts?.length || 0 });
  } catch (error) {
    return errorResponse(error);
  }
};
