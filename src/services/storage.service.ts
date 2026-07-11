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

  async getPublicUrl(imagePath: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('memory-images')
      .createSignedUrl(imagePath, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  },

  async getOptimizedUrl(
    imagePath: string,
    width = 500,
    quality = 80,
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from('memory-images')
      .createSignedUrl(imagePath, 3600, {
        transform: {
          width,
          quality,
          resize: 'contain',
        },
      });
    if (error) throw error;
    return data.signedUrl;
  },

  async getOptimizedUrlWithFallback(
    imagePath: string,
    width = 500,
    quality = 80,
  ): Promise<string> {
    return await this.getOptimizedUrl(imagePath, width, quality);
  },

  async getNonTransformedUrl(imagePath: string): Promise<string> {
    return await this.getPublicUrl(imagePath);
  },
};
