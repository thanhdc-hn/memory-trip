import { useCallback, useMemo, useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import { EXPORT_MAX_SELECTION, EXPORT_WARN_SELECTION } from '@/utils/constants';

export function useAlbumExport() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const toggle = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          return next;
        }
        if (next.size >= EXPORT_MAX_SELECTION) {
          toast({
            title: `You can select up to ${EXPORT_MAX_SELECTION} memories`,
            description: 'Deselect one to pick another.',
          });
          return prev;
        }
        next.add(id);
        if (next.size === EXPORT_WARN_SELECTION + 1) {
          toast({
            title: 'That is a big album 🐢',
            description: 'Larger albums may take a little longer on mobile.',
          });
        }
        return next;
      });
    },
    [toast],
  );

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  const count = selectedIds.size;

  return useMemo(
    () => ({ selectedIds, count, toggle, clear, isSelected }),
    [selectedIds, count, toggle, clear, isSelected],
  );
}
