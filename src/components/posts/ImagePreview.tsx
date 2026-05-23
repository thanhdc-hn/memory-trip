import { X } from 'lucide-react';

import React, { useEffect, useState } from 'react';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  onRemove,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="animate-in zoom-in-95 relative aspect-square w-full overflow-hidden rounded-2xl shadow-lg duration-300">
      <img
        src={previewUrl}
        alt="Preview"
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-3 right-3 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-transform active:scale-90"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};
