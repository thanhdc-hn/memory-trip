import { type FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { URL_PATH } from '@/utils/constants.ts';
import { generateInviteCode } from '@/utils/generateInviteCode';

export function CreateTeamSheet({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    name: string;
    invite_code: string;
    password?: string;
    post_limit?: number | null;
  }) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [password, setPassword] = useState('');
  const [postLimit, setPostLimit] = useState<number | null>(null);
  const [isManualInviteCode, setIsManualInviteCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isManualInviteCode && name) {
      setInviteCode(generateInviteCode(name));
    }
  }, [name, isManualInviteCode]);

  useEffect(() => {
    if (!open) {
      setName('');
      setInviteCode('');
      setPassword('');
      setPostLimit(null);
      setIsManualInviteCode(false);
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !inviteCode) return;

    setIsSubmitting(true);
    setError(null);

    const normalizedInviteCode = inviteCode.trim().toLowerCase();

    try {
      await onCreate({
        name: name.trim(),
        invite_code: normalizedInviteCode,
        password: password.trim() || undefined,
        post_limit: postLimit,
      });
      onOpenChange(false);
    } catch (err: any) {
      if (
        err.message?.includes('duplicate') ||
        err.message?.includes('unique')
      ) {
        setError('This team code already exists 🌙');
      } else {
        setError(err.message || 'Failed to create team');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Team"
      description="Set up a new space for memories."
      contentClassName="sm:max-w-[425px] rounded-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-bold text-gray-700">
              Team Name
            </label>
            <Input
              placeholder="e.g. Summer Trip 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <div className="ml-1 flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700">
                Invite Code
              </label>
              <span className="text-[10px] font-medium text-gray-400">
                {`${URL_PATH.JOIN}/${inviteCode || '...'}`}
              </span>
            </div>
            <Input
              placeholder="summer-trip-2024"
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(
                  e.target.value.toLowerCase().replace(/\s+/g, '-'),
                );
                setIsManualInviteCode(true);
              }}
              required
              className="rounded-xl"
            />
            {error && (
              <p className="ml-1 text-xs font-medium text-red-500">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-bold text-gray-700">
              Invite Password (optional)
            </label>
            <Input
              type="password"
              placeholder="Keep it secret"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-bold text-gray-700">
              Post Limit
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '30', value: 30 },
                { label: '50', value: 50 },
                { label: '100', value: 100 },
                { label: '∞', value: null },
              ].map((opt) => (
                <Button
                  key={opt.label}
                  type="button"
                  variant={postLimit === opt.value ? 'default' : 'outline'}
                  className="rounded-xl"
                  onClick={() => setPostLimit(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-xl"
            disabled={!name || !inviteCode || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Team'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
