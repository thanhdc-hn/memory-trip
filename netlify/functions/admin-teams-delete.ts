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
        body: JSON.stringify({ error: 'ID is required' }),
      };
    }

    // 1. Remove all images for this team from storage.
    //    List the team's folder directly so orphaned files are also cleaned,
    //    not just the ones referenced by posts.image_path. Paginate because
    //    Supabase storage .list() returns at most 100 items per call.
    const folder = `teams/${id}`;
    const pageSize = 100;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Always read from offset 0: each iteration removes the files it lists,
      // so the next batch shifts into the same window.
      const { data: files, error: listError } = await supabase.storage
        .from('memory-images')
        .list(folder, { limit: pageSize, offset: 0 });

      if (listError) {
        console.error('Error listing team images from storage:', listError);
        break; // Continue anyway so the team record can still be deleted.
      }

      if (!files || files.length === 0) break;

      const filePaths = files.map((file) => `${folder}/${file.name}`);
      const { error: storageError } = await supabase.storage
        .from('memory-images')
        .remove(filePaths);

      if (storageError) {
        console.error('Error deleting team images from storage:', storageError);
        break; // Continue anyway so the team record can still be deleted.
      }

      // Removed this page, so keep reading from the same offset (0).
      if (files.length < pageSize) break;
    }

    // 2. Delete the team's posts (in case there is no ON DELETE CASCADE).
    const { error: postsError } = await supabase
      .from('posts')
      .delete()
      .eq('team_id', id);

    if (postsError) throw postsError;

    // 3. Delete the team itself.
    const { error } = await supabase.from('teams').delete().eq('id', id);

    if (error) throw error;

    return successResponse({ deleted: id });
  } catch (error) {
    return errorResponse(error);
  }
};
