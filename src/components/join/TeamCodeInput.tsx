import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TeamCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  disabled?: boolean;
}

const PLACEHOLDERS = [
  'sunset-mango',
  'tokyo-trip',
  'sleepy-panda',
  'beach-vibes',
  'summer-2026',
  'mountain-high',
];

export function TeamCodeInput({
  value,
  onChange,
  onEnter,
  disabled,
}: TeamCodeInputProps) {
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => {
        const currentIndex = PLACEHOLDERS.indexOf(prev);
        return PLACEHOLDERS[(currentIndex + 1) % PLACEHOLDERS.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/\s+/g, '');
    onChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter();
    }
  };

  return (
    <div className="w-full space-y-2">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'focus-visible:ring-secondary bg-paper text-paper-text h-14 rounded-2xl border-4 border-dashed text-center text-xl font-bold transition-all',
          'placeholder:text-paper-text-muted/30 placeholder:font-normal',
        )}
        autoFocus
      />
    </div>
  );
}
