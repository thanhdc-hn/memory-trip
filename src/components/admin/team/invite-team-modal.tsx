import { Download, Share2 } from 'lucide-react';

import { useEffect, useState } from 'react';
import { default as QRCode } from 'react-qr-code';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Team } from '@/services/team.service';
import { URL_PATH } from '@/utils/constants';

interface InviteTeamModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteTeamModal({
  team,
  isOpen,
  onClose,
}: InviteTeamModalProps) {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  if (!team) return null;

  const inviteUrl = `${window.location.origin}${URL_PATH.JOIN}/${team.invite_code}`;

  const QRComponent = (QRCode as any).default || QRCode;

  const downloadQR = () => {
    const svg = document.getElementById('team-qr-code');
    if (!svg) return;

    // Create a copy of the SVG to modify for high-quality export
    const svgClone = svg.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute('width', '1000');
    svgClone.setAttribute('height', '1000');

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1200;
      canvas.height = 1200;
      if (ctx) {
        // Draw background
        ctx.fillStyle = '#f7f2eb';
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        ctx.roundRect
          ? ctx.roundRect(0, 0, 1200, 1200, 100)
          : ctx.rect(0, 0, 1200, 1200);
        ctx.fill();

        // Draw a white card for the QR
        ctx.fillStyle = '#ffffff';
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        ctx.roundRect
          ? ctx.roundRect(100, 100, 1000, 1000, 80)
          : ctx.rect(100, 100, 1000, 1000);
        ctx.fill();

        ctx.drawImage(img, 100, 100, 1000, 1000);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `invite-${team.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${team.name} on Memory Trip`,
          text: `Scan this QR code to join our trip: ${team.name}`,
          url: inviteUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden rounded-[2rem] border-none bg-[#fdfaf6] p-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:max-w-md">
        <div className="relative flex flex-col items-center p-8 text-center">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 -z-10 h-32 w-full rounded-b-[3rem] bg-[#f7f2eb]" />

          <DialogHeader className="mb-6">
            <DialogTitle className="font-serif text-2xl font-bold text-[#2b2b2b]">
              ✨ Scan to join the trip
            </DialogTitle>
            <p className="mt-1 text-sm font-medium text-[#8b7e6d]">
              Invite friends into the journey
            </p>
          </DialogHeader>

          {/* QR Code Container */}
          <div className="group relative">
            <div className="absolute -inset-4 animate-pulse rounded-full bg-white/50 opacity-50 blur-xl transition-opacity group-hover:opacity-100" />
            <div className="relative rounded-[2.5rem] border-2 border-dashed border-[#e6ddd0] bg-[#f7f2eb] p-6 shadow-inner">
              <div className="rounded-2xl border border-[#e6ddd0]/50 bg-white p-4 shadow-sm">
                <QRComponent
                  id="team-qr-code"
                  value={inviteUrl}
                  size={200}
                  level="H"
                  fgColor="#2b2b2b"
                  bgColor="#ffffff"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 w-full max-w-[280px] space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={downloadQR}
                className="h-12 flex-1 rounded-2xl bg-[#2b2b2b] font-bold text-white shadow-lg shadow-black/10 transition-transform hover:bg-[#3d3d3d] active:scale-95"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              {canShare && (
                <Button
                  onClick={shareQR}
                  variant="outline"
                  className="h-12 flex-1 rounded-2xl border-[#e6ddd0] font-bold text-[#2b2b2b] transition-transform hover:bg-[#f7f2eb] active:scale-95"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full font-medium text-[#8b7e6d] hover:bg-transparent hover:text-[#2b2b2b]"
            >
              Close
            </Button>
          </div>

          <div className="mt-6 text-[10px] font-bold tracking-widest text-[#d4c8b8] uppercase">
            Share this memory space
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
