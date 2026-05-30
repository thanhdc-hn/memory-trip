import React from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('posts');
  const onCreatePostSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t('sheetTitle')}
      description={t('sheetDescription')}
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
