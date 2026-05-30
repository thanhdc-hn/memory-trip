import { Star } from 'lucide-react';

import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Float, Tape } from '@/components/animation/animation-utils';
import { HomeHowItWorks } from '@/components/home/home-how-it-works';
import { HomeWelcomeCard } from '@/components/home/home-welcome-card';
import { TeamCodeModal } from '@/components/join/TeamCodeModal';
import { AppLayout, MasonryGrid } from '@/components/layout/layout-primitives';
import { MemoryPostCard } from '@/components/memory/memory-post-card';
import { Divider } from '@/components/ui/divider';
import { STORAGE_KEY, URL_PATH } from '@/utils/constants.ts';
import storage from '@/utils/storage.ts';

const Home: FC = () => {
  const navigate = useNavigate();
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const teamId = storage.get<string>(STORAGE_KEY.TEAM_ID);
    const nickname = storage.get<string>(STORAGE_KEY.NICKNAME);
    if (teamId && nickname) {
      navigate(URL_PATH.TIMELINE);
    } else {
      // storage.clear();
    }
  }, [navigate]);

  const handleReadyClick = () => {
    setShowJoinModal(true);
  };

  return (
    <AppLayout
      header={
        <header className="relative space-y-4 text-center">
          <span className="animate-float absolute -top-2 left-4 text-3xl opacity-40 md:left-16">
            🌴
          </span>
          <span
            className="animate-float absolute -top-2 right-4 text-3xl opacity-40 md:right-16"
            style={{ animationDelay: '0.6s' }}
          >
            📷
          </span>
          <Float>
            <div className="relative inline-block">
              <Tape rotation={-3} />
              <div className="text-accent text-5xl font-bold drop-shadow-sm md:text-7xl">
                Memory Trip
              </div>
            </div>
          </Float>
          <p className="font-handwritten text-text mx-auto max-w-md text-2xl">
            "Our shared scrapbook of the best summer ever!"
          </p>
          <p className="font-rounded text-text/60 mx-auto max-w-lg text-lg">
            Collect your team's trip photos and notes in one cozy place — then
            relive them together.
          </p>
        </header>
      }
      footer={
        <div className="mx-auto w-full max-w-2xl px-4 pb-12">
          <Divider variant="dashed" className="mb-12" />
          <HomeWelcomeCard onReadyClick={handleReadyClick} />
        </div>
      }
    >
      <section className="space-y-12">
        <div>
          <div className="mb-2 flex items-center gap-2 text-3xl font-bold">
            <Star className="text-accent fill-accent" /> Recent Memories
          </div>
          <p className="font-rounded text-text/60 mb-6 text-lg">
            A peek at the little moments teams are collecting together.
          </p>
          <MasonryGrid>
            <MemoryPostCard
              imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
              title="Sunset at the beach! 🌴"
              author="Junie"
              date="2026-08-12"
              rotation={2}
            />
            <MemoryPostCard
              imageUrl="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
              title="Night market snacks 🍡"
              author="Alex"
              date="2026-08-13"
              rotation={-2}
            />
            <MemoryPostCard
              title="Had the most amazing ice cream today with the team! Best summer ever. 🍦✨"
              author="Sam"
              date="2026-08-14"
              rotation={1}
            />
            <MemoryPostCard
              imageUrl="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
              title="Morning hike views 🏔️"
              author="Mai"
              date="2026-08-15"
              rotation={-1}
            />
          </MasonryGrid>
        </div>

        <Divider variant="dashed" />

        <HomeHowItWorks />
      </section>

      <TeamCodeModal open={showJoinModal} onOpenChange={setShowJoinModal} />
    </AppLayout>
  );
};

export default Home;
