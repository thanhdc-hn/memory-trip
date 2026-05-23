import { Star } from 'lucide-react';

import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Float, Tape } from '@/components/animation/animation-utils';
import { HomeWelcomeCard } from '@/components/home/home-welcome-card';
import { TeamCodeModal } from '@/components/join/TeamCodeModal';
import { AppLayout, MasonryGrid } from '@/components/layout/layout-primitives';
import { MemoryPostCard } from '@/components/memory/memory-post-card';
import { Divider } from '@/components/ui/divider';
import { supabase } from '@/lib/supabase.ts';

const Home: FC = () => {
  const navigate = useNavigate();
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const teamId = localStorage.getItem('team_id');
    const nickname = localStorage.getItem('nickname');
    if (teamId && nickname) {
      navigate('/timeline');
    }

    const checkSupabase = async () => {
      await supabase.auth.signOut();

      const { data } = await supabase.auth.getUser();

      console.log(data);
    };
    checkSupabase();
  }, [navigate]);

  const handleReadyClick = () => {
    setShowJoinModal(true);
  };

  return (
    <AppLayout
      header={
        <header className="relative space-y-4 text-center">
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
          <div className="mb-6 flex items-center gap-2 text-3xl font-bold">
            <Star className="text-accent fill-accent" /> Recent Memories
          </div>
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
              rotation={-3}
            />
            <MemoryPostCard
              title="Had the most amazing ice cream today with the team! Best summer ever. 🍦✨"
              author="Sam"
              date="2026-08-14"
              rotation={1}
            />
          </MasonryGrid>
        </div>
      </section>

      <TeamCodeModal open={showJoinModal} onOpenChange={setShowJoinModal} />
    </AppLayout>
  );
};

export default Home;
