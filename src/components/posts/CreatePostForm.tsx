import { Heart, Send } from 'lucide-react';

import React, { useState } from 'react';

import { useCreatePost } from '@/hooks/posts/use-create-post';
import { type Post } from '@/services/posts.service';

import { CaptionInput } from './CaptionInput';
import { ImagePicker } from './ImagePicker';
import { ImagePreview } from './ImagePreview';

interface CreatePostFormProps {
  teamId: string;
  onSuccess: () => void;
  onOptimisticPost: (post: Post) => void;
  onRollback: (postId: string) => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  teamId,
  onSuccess,
  onOptimisticPost,
  onRollback,
}) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { createPost, isCreating } = useCreatePost();
  const nickname = localStorage.getItem('nickname') || 'Traveler';

  const isValid = caption.trim().length > 0 || image !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isCreating) return;

    setError(null);
    try {
      await createPost(
        {
          teamId,
          authorName: nickname,
          caption: caption.trim() || undefined,
          image: image || undefined,
        },
        onOptimisticPost,
        onRollback,
      );
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 px-1">
        <div className="bg-accent/20 flex h-8 w-8 items-center justify-center rounded-full">
          <Heart className="text-accent fill-accent h-4 w-4" />
        </div>
        <span className="text-text/60 text-sm font-semibold">
          Posting as <span className="text-accent">{nickname}</span>
        </span>
      </div>

      <div className="space-y-4">
        {image ? (
          <ImagePreview file={image} onRemove={() => setImage(null)} />
        ) : (
          <ImagePicker onImageSelect={setImage} disabled={isCreating} />
        )}

        <CaptionInput
          value={caption}
          onChange={setCaption}
          disabled={isCreating}
        />
      </div>

      {error && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || isCreating}
        className="bg-accent flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:shadow-none"
      >
        {isCreating ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-3 border-white/30 border-t-white" />
            <span>Sending memory...</span>
          </div>
        ) : (
          <>
            <Send className="h-5 w-5" />
            <span>Post Memory</span>
          </>
        )}
      </button>
    </form>
  );
};
