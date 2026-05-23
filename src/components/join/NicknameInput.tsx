import { Sparkles } from 'lucide-react';

import { useEffect, useState } from 'react';

import { Float, Pop } from '@/components/animation/animation-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTooltipState } from '@/hooks/use-tooltip-state';
import { cn } from '@/lib/utils';
import { STORAGE_KEY } from '@/utils/constants.ts';

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
  const { showTooltip, dismiss } = useTooltipState(
    STORAGE_KEY.NICKNAME_TOOLTIP,
  );

  const handleRandomize = () => {
    if (showTooltip) dismiss();
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
            className="pr-12 text-center text-[16px] sm:text-lg"
            onFocus={(e) => {
              requestAnimationFrame(() => {
                e.target.select();
              });
            }}
          />
        </Pop>
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          {showTooltip && (
            <div className="absolute -top-16 -right-1.5 z-20 w-48 opacity-90">
              <Float delay={0.2}>
                <div className="bg-primary text-primary-foreground font-handwritten relative rounded-xl px-3 py-2 text-sm shadow-lg">
                  ✨ Not feeling this one? Try another nickname!
                  {/* Speech bubble arrow */}
                  <div className="border-t-primary absolute right-4 -bottom-1.5 h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent" />
                </div>
              </Float>
            </div>
          )}
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
