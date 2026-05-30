import { LogOut } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { STORAGE_KEY } from '@/utils/constants';
import storage from '@/utils/storage';

interface QuitTeamDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function QuitTeamDialog({
  open,
  onOpenChange,
}: QuitTeamDialogProps = {}) {
  const navigate = useNavigate();

  const handleQuit = () => {
    storage.remove(STORAGE_KEY.TEAM_ID);
    storage.remove(STORAGE_KEY.NICKNAME);
    navigate('/');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {onOpenChange === undefined && (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-text/60 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Quit Team</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Leaving so soon? 🥺
          </DialogTitle>
          <DialogDescription className="pt-4 text-center text-base">
            We will miss you and your memories! Are you sure you want to quit
            this team?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6 text-6xl">👋</div>
        <DialogFooter className="gap-2 sm:justify-center">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1 sm:flex-none">
              I'll stay!
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="flex-1 sm:flex-none"
            onClick={handleQuit}
          >
            Yes, quit team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
