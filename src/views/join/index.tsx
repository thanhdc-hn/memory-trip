import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Float } from '@/components/animation/animation-utils';
import { ArchivedTeamState } from '@/components/join/ArchivedTeamState';
import { InvalidTeamState } from '@/components/join/InvalidTeamState';
import { JoinButton } from '@/components/join/JoinButton';
import { JoinCard } from '@/components/join/JoinCard';
import { JoinLayout } from '@/components/join/JoinLayout';
import { JoinSkeleton } from '@/components/join/JoinSkeleton';
import { NicknameInput } from '@/components/join/NicknameInput';
import { PasswordInput } from '@/components/join/PasswordInput';
import { generateRandomNickname } from '@/features/join/utils/randomNickname';
import { usePublicTeam } from '@/hooks/use-public-team';

export default function JoinPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { t, i18n } = useTranslation('join');
  const { team, loading, joinTeam, verifyPassword } = usePublicTeam(inviteCode);

  const welcomeMessages = t('welcomeMessages', {
    returnObjects: true,
  }) as string[];

  const [nickname, setNickname] = useState(() =>
    generateRandomNickname(i18n.language),
  );
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [welcomeIndex] = useState(() =>
    Math.floor(Math.random() * welcomeMessages.length),
  );
  const welcomeMessage = welcomeMessages[welcomeIndex];

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    // Validate nickname
    if (!nickname.trim()) return;

    setIsJoining(true);

    // Validate password if required
    if (team.has_password) {
      const isValid = await verifyPassword(password);
      if (!isValid) {
        setPasswordError(true);
        setIsJoining(false);
        setTimeout(() => setPasswordError(false), 1000);
        return;
      }
    }

    // Tiny delay for success transition feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    joinTeam(nickname);
  };

  if (loading) {
    return (
      <JoinLayout>
        <JoinSkeleton />
      </JoinLayout>
    );
  }

  if (!team) {
    return (
      <JoinLayout>
        <InvalidTeamState />
      </JoinLayout>
    );
  }

  if (team.is_locked) {
    return (
      <JoinLayout>
        <ArchivedTeamState name={team.name} />
      </JoinLayout>
    );
  }

  return (
    <JoinLayout>
      <form onSubmit={handleJoin}>
        <JoinCard>
          <div className="space-y-1">
            <h1 className="text-primary text-3xl font-bold">{team.name}</h1>
            <p className="font-handwritten text-paper-text-muted text-lg italic">
              {welcomeMessage}
            </p>
          </div>

          <Float delay={0.2}>
            <div className="my-2 text-7xl">📸</div>
          </Float>

          <div className="w-full space-y-6">
            <NicknameInput
              value={nickname}
              onChange={setNickname}
              onRandomize={() =>
                setNickname(generateRandomNickname(i18n.language))
              }
              disabled={isJoining}
            />

            {team.has_password && (
              <PasswordInput
                value={password}
                onChange={setPassword}
                error={passwordError}
                disabled={isJoining}
              />
            )}
          </div>

          <JoinButton
            loading={isJoining}
            disabled={!nickname.trim() || (team.has_password && !password)}
          />
        </JoinCard>
      </form>

      {/* Decorative stickers */}
      <div className="pointer-events-none fixed inset-0 hidden overflow-hidden md:block">
        <div className="absolute top-[20%] left-[10%] -rotate-12 opacity-20">
          <div className="text-6xl">🌴</div>
        </div>
        <div className="absolute right-[15%] bottom-[15%] rotate-12 opacity-20">
          <div className="text-6xl">🍦</div>
        </div>
        <div className="absolute top-[10%] right-[10%] rotate-6 opacity-20">
          <div className="text-6xl">⭐</div>
        </div>
      </div>
    </JoinLayout>
  );
}
