import { useState } from 'react';

import { compressImage } from '@/features/posts/utils/compressImage';
import { storageService } from '@/services/storage.service';

export function useUploadImage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadImage = async (teamId: string, postId: string, file: File) => {
    setUploading(true);
    setError(null);
    try {
      const compressedFile = await compressImage(file);
      return await storageService.uploadPostImage(
        teamId,
        postId,
        compressedFile,
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}
