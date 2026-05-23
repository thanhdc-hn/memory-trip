import { Mail, Sparkles } from 'lucide-react';

import { type FC, useEffect, useState } from 'react';

import { Float, Pop } from '@/components/animation/animation-utils';
import { Button } from '@/components/ui/button';

interface Greeting {
  title: string;
  subtitle: string;
  emoji: string;
}

const GREETINGS: Greeting[] = [
  {
    title: 'Tiny moments become memories ✨',
    subtitle: 'Ready for this trip?',
    emoji: '📸',
  },
  {
    title: "Collect your team's little memories 🌴",
    subtitle: 'One photo at a time.',
    emoji: '🌊',
  },
  {
    title: 'A cozy place for your trip memories 🌞',
    subtitle: 'Start your adventure today.',
    emoji: '🍦',
  },
  {
    title: 'Our best summer starts here 🐚',
    subtitle: 'Share the magic together.',
    emoji: '🍹',
  },
];

interface HomeWelcomeCardProps {
  onReadyClick: () => void;
}

export const HomeWelcomeCard: FC<HomeWelcomeCardProps> = ({ onReadyClick }) => {
  const [greeting, setGreeting] = useState<Greeting>(GREETINGS[0]);

  useEffect(() => {
    const randomGreeting =
      GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setGreeting(randomGreeting);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-2xl text-center">
      <div className="absolute -top-4 left-1/4 -z-10 animate-pulse text-4xl opacity-20">
        ✨
      </div>
      <div className="animate-bounce-slow absolute top-1/2 right-1/4 -z-10 text-4xl opacity-20">
        🌴
      </div>

      <Pop>
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-handwritten text-text text-4xl font-bold md:text-6xl">
              {greeting.title}
            </h2>
            <p className="font-rounded text-text/60 text-xl md:text-2xl">
              {greeting.subtitle}
            </p>
          </div>

          <Float>
            <Button
              variant="sticker"
              size="lg"
              onClick={onReadyClick}
              className="group relative h-16 rounded-full px-12 text-2xl shadow-xl transition-all hover:scale-105"
            >
              <Sparkles className="mr-2 h-6 w-6 animate-pulse text-yellow-300 transition-transform group-hover:scale-125" />
              READY!
              <span className="ml-2 inline-block transition-transform group-hover:rotate-12">
                {greeting.emoji}
              </span>
            </Button>
          </Float>
        </div>
      </Pop>

      <div className="mt-10 flex justify-center gap-6 text-2xl opacity-40">
        <span className="animate-float" style={{ animationDelay: '0.2s' }}>
          🌸
        </span>
        <span className="animate-float" style={{ animationDelay: '0.5s' }}>
          🐚
        </span>
        <span className="animate-float" style={{ animationDelay: '0.8s' }}>
          ☀️
        </span>
      </div>

      <div className="mt-12 flex flex-col items-center gap-2">
        <p className="font-rounded text-text/40 text-sm">
          Want to say hi? Please contact me via email.
        </p>
        <a
          href="mailto:thanh.duong1@ntq-solution.com.vn"
          className="group font-handwritten text-text/60 hover:text-primary flex items-center gap-2 text-lg transition-colors"
        >
          <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
          thanh.duong1@ntq-solution.com.vn
        </a>
      </div>
    </div>
  );
};
