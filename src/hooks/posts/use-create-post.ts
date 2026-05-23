import { useState } from 'react';

import { type Post, postsService } from '@/services/posts.service';

import { useUploadImage } from './use-upload-image';

interface CreatePostParams {
  teamId: string;
  authorName: string;
  caption?: string;
  image?: File;
}

export function useCreatePost() {
  const [isCreating, setIsCreating] = useState(false);
  const { uploadImage, uploading } = useUploadImage();

  const createPost = async (
    params: CreatePostParams,
    onOptimisticUpdate?: (post: Post) => void,
    onRollback?: (postId: string) => void,
  ) => {
    const { teamId, authorName, caption, image } = params;

    if (!caption && !image) {
      throw new Error('Either image or caption is required');
    }

    setIsCreating(true);

    // Generate a temporary ID for optimistic update and image path
    const tempId = crypto.randomUUID();

    // Create optimistic post
    const optimisticPost: Post = {
      id: tempId,
      team_id: teamId,
      author_name: authorName,
      caption: caption || null,
      image_path: image ? URL.createObjectURL(image) : null,
      created_at: new Date().toISOString(),
      isFreshUpload: true,
    };

    if (onOptimisticUpdate) {
      onOptimisticUpdate(optimisticPost);
    }

    try {
      let imagePath = null;
      if (image) {
        imagePath = await uploadImage(teamId, tempId, image);
      }

      const postData = {
        id: tempId,
        team_id: teamId,
        author_name: authorName,
        caption: caption || null,
        image_path: imagePath,
      };

      const newPost = await postsService.createPost(postData);
      return { ...newPost, isFreshUpload: true };
    } catch (error) {
      if (onRollback) {
        onRollback(tempId);
      }
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createPost, isCreating: isCreating || uploading };
}
