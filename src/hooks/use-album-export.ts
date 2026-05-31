import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useToast } from '@/hooks/use-toast';
import { EXPORT_MAX_SELECTION, EXPORT_WARN_SELECTION } from '@/utils/constants';

export function useAlbumExport() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [coverId, setCoverId] = useState<string | null>(null);
  const { t } = useTranslation('export');
  const { toast } = useToast();

  const toggle = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          // Drop the cover if its post was deselected.
          setCoverId((c) => (c === id ? null : c));
          return next;
        }
        if (next.size >= EXPORT_MAX_SELECTION) {
          toast({
            title: t('toasts.maxTitle', { max: EXPORT_MAX_SELECTION }),
            description: t('toasts.maxDesc'),
          });
          return prev;
        }
        next.add(id);
        if (next.size === EXPORT_WARN_SELECTION + 1) {
          toast({
            title: t('toasts.bigTitle'),
            description: t('toasts.bigDesc'),
          });
        }
        return next;
      });
    },
    [toast, t],
  );

  // Toggle a post as the cover (only meaningful for selected image posts).
  const setCover = useCallback(
    (id: string) => setCoverId((c) => (c === id ? null : id)),
    [],
  );

  const clear = useCallback(() => {
    setSelectedIds(new Set());
    setCoverId(null);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  const count = selectedIds.size;

  return useMemo(
    () => ({
      selectedIds,
      count,
      coverId,
      toggle,
      setCover,
      clear,
      isSelected,
    }),
    [selectedIds, count, coverId, toggle, setCover, clear, isSelected],
  );
}
