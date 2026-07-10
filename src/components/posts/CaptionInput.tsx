import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface CaptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CaptionInput: React.FC<CaptionInputProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation('posts');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 300) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-1">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={t('captionPlaceholder')}
        className="font-handwritten focus:ring-accent/20 placeholder:text-text/40 bg-card/50 min-h-[120px] w-full resize-none rounded-2xl border-none p-4 text-lg placeholder:font-sans focus:ring-2"
      />
      <div className="flex justify-end pr-2">
        <span
          className={`text-xs font-medium ${value.length >= 300 ? 'text-red-500' : 'text-text/60'}`}
        >
          {value.length}/300
        </span>
      </div>
    </div>
  );
};
