import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function PasswordInput({
  value,
  onChange,
  error,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="w-full space-y-2 text-left">
      <Label htmlFor="password" className="font-handwritten ml-2 block text-lg">
        Secret Key
      </Label>
      <Input
        id="password"
        type="password"
        placeholder="Enter team password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'text-center text-[16px] transition-transform sm:text-lg',
          error && 'border-coral animate-shake',
        )}
      />
      {error && (
        <p className="text-coral font-rounded px-2 text-center text-xs">
          Oops! Wrong password ✨
        </p>
      )}
    </div>
  );
}
