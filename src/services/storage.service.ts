import { supabase } from '@/lib/supabase';

export const storageService = {
  async uploadPostImage(
    teamId: string,
    postId: string,
    file: File,
  ): Promise<string> {
    const filePath = `teams/${teamId}/${postId}.webp`;

    const { error } = await supabase.storage
      .from('memory-images')
      .upload(filePath, file, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) throw error;

    return filePath;
  },

  getPublicUrl(imagePath: string): string {
    const { data } = supabase.storage
      .from('memory-images')
      .getPublicUrl(imagePath);

    return data.publicUrl;
  },

  getOptimizedUrl(imagePath: string, width = 500, quality = 80): string {
    const { data } = supabase.storage
      .from('memory-images')
      .getPublicUrl(imagePath, {
        transform: {
          width,
          quality,
          resize: 'contain',
        },
      });

    return data.publicUrl;
  },
};
