import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function NicknameInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="w-full space-y-2 text-left">
      <Label htmlFor="nickname" className="font-handwritten ml-2 text-lg">
        What's your nickname?
      </Label>
      <Input
        id="nickname"
        placeholder="Type something cute..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={20}
        required
        disabled={disabled}
        autoFocus
        className="text-center text-lg"
      />
      <div className="px-2 text-right">
        <span className="text-text/40 font-rounded text-xs">
          {value.length}/20
        </span>
      </div>
    </div>
  );
}
