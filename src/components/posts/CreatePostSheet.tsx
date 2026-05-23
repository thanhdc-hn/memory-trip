import React from 'react';

import { Modal } from '@/components/ui/modal';
import { type Post } from '@/services/posts.service';

import { CreatePostForm } from './CreatePostForm';

interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  onOptimisticPost: (post: Post) => void;
  onRollback: (postId: string) => void;
  onSuccess?: () => void;
}

export const CreatePostSheet: React.FC<CreatePostSheetProps> = ({
  open,
  onOpenChange,
  teamId,
  onOptimisticPost,
  onRollback,
  onSuccess,
}) => {
  const onCreatePostSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="New Memory"
      description="Share a moment from your trip"
      contentClassName="sm:max-w-md rounded-3xl"
    >
      <div className="py-4">
        <CreatePostForm
          teamId={teamId}
          onSuccess={onCreatePostSuccess}
          onOptimisticPost={onOptimisticPost}
          onRollback={onRollback}
        />
      </div>
    </Modal>
  );
};
