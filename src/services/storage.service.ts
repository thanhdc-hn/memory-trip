import { supabase } from '@/lib/supabase';

export const storageService = {
  getPublicUrl(path: string): string {
    const { data } = supabase.storage.from('memories').getPublicUrl(path);
    return data.publicUrl;
  },
};
