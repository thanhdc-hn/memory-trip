import { Camera, Image as ImageIcon } from 'lucide-react';

import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ImagePickerProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  onImageSelect,
  disabled,
}) => {
  const { t } = useTranslation('posts');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
    // Reset input so the same file can be picked again if removed
    e.target.value = '';
  };

  const openGallery = () => fileInputRef.current?.click();
  const openCamera = () => cameraInputRef.current?.click();

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={openCamera}
        disabled={disabled}
        className="border-accent/30 bg-accent/5 active:bg-accent/10 flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 transition-colors disabled:opacity-50"
      >
        <Camera className="text-accent h-8 w-8" />
        <span className="text-accent text-sm font-medium">
          {t('takePhoto')}
        </span>
      </button>

      <button
        type="button"
        onClick={openGallery}
        disabled={disabled}
        className="border-primary/30 bg-primary/5 active:bg-primary/10 flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 transition-colors disabled:opacity-50"
      >
        <ImageIcon className="text-primary h-8 w-8" />
        <span className="text-primary text-sm font-medium">{t('gallery')}</span>
      </button>

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
