import { ArrowLeft, Loader2, Shield } from 'lucide-react';

import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function AdminAuthModal({
  onLogin,
}: {
  onLogin: (password: string) => Promise<boolean>;
}) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsSubmitting(true);
    setError(false);

    const success = await onLogin(password);
    if (!success) {
      setError(true);
      setIsSubmitting(false);
      // Reset shake after animation
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div
        className={cn(
          'flex w-full max-w-sm flex-col items-center gap-6 p-8 transition-all',
          error && 'animate-shake',
        )}
      >
        <div className="bg-primary/10 mb-2 flex h-16 w-16 items-center justify-center rounded-3xl">
          <Shield className="text-primary h-8 w-8" />
        </div>

        <div className="space-y-2 text-center">
          <div className="text-2xl font-bold text-gray-900">Admin Access</div>
          <p className="text-gray-500">
            Please enter your password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
            autoFocus
          />
          <Button
            type="submit"
            className="h-12 w-full rounded-2xl text-lg"
            disabled={isSubmitting || !password}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Unlock Dashboard'
            )}
          </Button>
        </form>

        {error && (
          <p className="animate-in fade-in slide-in-from-top-1 text-sm font-medium text-red-500">
            Invalid credentials. Please try again.
          </p>
        )}

        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">Lost your way? 🧐</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-primary hover:bg-primary/5 gap-2 rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to safety
          </Button>
        </div>
      </div>
    </div>
  );
}
