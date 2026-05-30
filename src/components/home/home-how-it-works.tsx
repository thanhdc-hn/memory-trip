import { type FC } from 'react';

import { Float, Pop } from '@/components/animation/animation-utils';

interface Step {
  emoji: string;
  title: string;
  description: string;
  rotation: number;
}

const STEPS: Step[] = [
  {
    emoji: '🎟️',
    title: 'Join your team',
    description: 'Enter the team code your friends shared with you.',
    rotation: -2,
  },
  {
    emoji: '📸',
    title: 'Snap & share',
    description: 'Post your photos and little notes as the trip happens.',
    rotation: 2,
  },
  {
    emoji: '📖',
    title: 'Relive & export',
    description: 'Browse the timeline and save it all as a PDF album.',
    rotation: -1,
  },
];

export const HomeHowItWorks: FC = () => {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-3xl font-bold">
        <span className="text-accent">🧭</span> How It Works
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
        {STEPS.map((step, index) => (
          <Pop key={step.title}>
            <div
              className="shadow-polaroid relative flex flex-col items-center gap-3 rounded-sm bg-white p-6 pt-8 text-center transition-transform duration-300 hover:rotate-0"
              style={{ transform: `rotate(${step.rotation}deg)` }}
            >
              <div className="bg-accent text-text-h absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white text-lg font-bold shadow-sm">
                {index + 1}
              </div>
              <Float delay={index * 0.2}>
                <span className="text-5xl">{step.emoji}</span>
              </Float>
              <p className="font-handwritten text-text-h text-2xl font-bold">
                {step.title}
              </p>
              <p className="font-rounded text-text/60 text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          </Pop>
        ))}
      </div>
    </div>
  );
};
