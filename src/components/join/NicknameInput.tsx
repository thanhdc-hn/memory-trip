import { Sparkles } from 'lucide-react';

import { useEffect, useState } from 'react';

import { Pop } from '@/components/animation/animation-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function NicknameInput({
  value,
  onChange,
  onRandomize,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onRandomize: () => void;
  disabled?: boolean;
}) {
  const [isRotating, setIsRotating] = useState(false);
  const [triggerPop, setTriggerPop] = useState(false);

  const handleRandomize = () => {
    setIsRotating(true);
    onRandomize();
    setTriggerPop(true);
    setTimeout(() => setIsRotating(false), 500);
    setTimeout(() => setTriggerPop(false), 300);
  };

  // Also trigger pop when value changes from outside (initialization)
  useEffect(() => {
    setTriggerPop(true);
    const timer = setTimeout(() => setTriggerPop(false), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="w-full space-y-2 text-left">
      <Label htmlFor="nickname" className="font-handwritten ml-2 text-lg">
        What's your nickname?
      </Label>
      <div className="group relative">
        <Pop trigger={triggerPop}>
          <Input
            id="nickname"
            placeholder="Type something cute..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={25}
            required
            disabled={disabled}
            autoFocus
            className="pr-12 text-center text-lg"
          />
        </Pop>
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRandomize}
            disabled={disabled}
            className="hover:bg-primary/10 text-primary h-8 w-8 rounded-full transition-colors"
            title="Randomize nickname"
          >
            <Sparkles
              className={cn(
                'h-5 w-5 transition-transform duration-500',
                isRotating && 'scale-125 rotate-360',
              )}
            />
          </Button>
        </div>
      </div>
      <div className="px-2 text-right">
        <span className="text-text/40 font-rounded text-xs">
          {value.length}/25
        </span>
      </div>
    </div>
  );
}
