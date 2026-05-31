import dayjs from 'dayjs';
import { Download } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { URL_PATH } from '@/utils/constants';
import storage from '@/utils/storage';
import { getDateFormat } from '@/utils/time';

const SHOW_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

export function ClosureWarningModal({
  teamId,
  closeAt,
}: {
  teamId?: string;
  closeAt?: string | null;
}) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('timeline');
  const storageKey = `closure-warning-shown:${teamId}`;
  const [open, setOpen] = useState(() => {
    const isScheduled = !!closeAt && dayjs(closeAt).isAfter(dayjs());
    if (!isScheduled || !teamId) return false;
    const last = storage.get<number>(storageKey) ?? 0;
    return Date.now() - last >= SHOW_INTERVAL;
  });

  const isScheduled = !!closeAt && dayjs(closeAt).isAfter(dayjs());

  useEffect(() => {
    if (isScheduled && teamId) {
      const last = storage.get<number>(storageKey) ?? 0;
      const shouldOpen = Date.now() - last >= SHOW_INTERVAL;
      setOpen(shouldOpen);
    } else {
      setOpen(false);
    }
  }, [isScheduled, teamId, storageKey]);

  const handleOpenChange = (next: boolean) => {
    if (!next) storage.set(storageKey, Date.now());
    setOpen(next);
  };

  if (!isScheduled) return null;

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={t('closure.title')}
      description={t('closure.description', {
        date: dayjs(closeAt).format(getDateFormat(i18n.language)),
      })}
      contentClassName="sm:max-w-[425px]"
    >
      <div className="flex justify-center py-6 text-6xl">📦</div>
      <Button
        className="w-full gap-2"
        onClick={() => {
          handleOpenChange(false);
          navigate(URL_PATH.EXPORT);
        }}
      >
        <Download className="h-4 w-4" />
        {t('closure.export')}
      </Button>
    </Modal>
  );
}
