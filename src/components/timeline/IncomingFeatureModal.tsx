import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface IncomingFeatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IncomingFeatureModal({
  open,
  onOpenChange,
}: IncomingFeatureModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Coming Soon! 🚀"
      contentClassName="sm:max-w-md rounded-3xl"
      footer={
        <Button onClick={() => onOpenChange(false)} className="w-full">
          Got it!
        </Button>
      }
    >
      <div className="space-y-4 py-6 text-center">
        <div className="animate-bounce text-6xl">🛠️</div>
        <p className="font-handwritten text-text/70 text-lg">
          We're still working on post details, comments, and reactions. Stay
          tuned for the next update!
        </p>
      </div>
    </Modal>
  );
}
