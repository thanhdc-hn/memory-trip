import {
  Camera,
  Heart,
  MapPin,
  MessageCircle,
  Moon,
  Share2,
  Star,
  Sun,
} from 'lucide-react';

import { type FC } from 'react';

import { Float, Pop, Tape } from '@/components/animation/animation-utils';
import { AppLayout, MasonryGrid } from '@/components/layout/layout-primitives';
import { MemoryPostCard } from '@/components/memory/memory-post-card';
import { UploadFabButton } from '@/components/memory/upload-fab-button';
import { useTheme } from '@/components/theme/theme-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { ImageFrame } from '@/components/ui/image-frame';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Home: FC = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  return (
    <AppLayout
      header={
        <header className="relative space-y-4 text-center">
          <div className="absolute top-0 right-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'summer' ? 'sunset' : 'summer')}
              className="rounded-full"
            >
              {theme === 'summer' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
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
        <footer className="border-border mx-auto flex w-full max-w-2xl items-center justify-between rounded-3xl border-2 border-dashed bg-white/40 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <MapPin className="text-accent" />
            <span className="font-rounded font-bold">12 Places Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="text-secondary" />
            <span className="font-rounded font-bold">48 Memories</span>
          </div>
          <Badge variant="nickname">Team Summer '26</Badge>
        </footer>
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
              date="Aug 12, 2026"
              tags={['beach', 'sunset']}
              rotation={2}
            />
            <MemoryPostCard
              imageUrl="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
              title="Night market snacks 🍡"
              author="Alex"
              date="Aug 13, 2026"
              tags={['food', 'market']}
              rotation={-3}
            />
            <MemoryPostCard
              imageUrl="https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=800&q=80"
              title="My lovely room ^^ I love sunshine"
              author="Sam"
              date="Aug 14, 2026"
              tags={['pool', 'chill']}
              rotation={1}
            />
          </MasonryGrid>
        </div>

        <Divider variant="dashed" className="my-16" />

        <div className="space-y-16 pb-20">
          <header className="text-center">
            <Badge variant="nickname" className="mb-2">
              UI Component Library
            </Badge>
            <div className="text-4xl font-bold">Design System Showcase</div>
            <p className="font-handwritten text-text/60 mt-2 text-xl">
              Check out all our cute summer components!
            </p>
          </header>

          {/* Buttons Section */}
          <section className="space-y-6">
            <div className="border-accent/20 border-b-2 pb-2 text-2xl font-bold">
              Buttons & Interaction
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent Color</Button>
              <Button variant="outline">Outline Style</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="sticker" size="sticker">
                Sticker Button!
              </Button>
              <Button variant="sticker" size="sticker" className="bg-coral">
                Sticker Coral
              </Button>
            </div>
          </section>

          {/* Badges & Avatars */}
          <section className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="border-accent/20 border-b-2 pb-2 text-2xl font-bold">
                Badges
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Coral Badge</Badge>
                <Badge variant="nickname">@nickname_badge</Badge>
                <Badge variant="tag">#summer_vibe</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>
            <div className="space-y-6">
              <div className="border-accent/20 border-b-2 pb-2 text-2xl font-bold">
                Avatars
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="border-secondary h-12 w-12">
                  <AvatarFallback className="bg-mint/30 text-secondary">
                    AM
                  </AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" />
                </Avatar>
              </div>
            </div>
          </section>

          {/* Cards & Frames */}
          <section className="space-y-8">
            <div className="border-accent/20 border-b-2 pb-2 text-2xl font-bold">
              Cards & Scrapbook Elements
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>
                    A cozy rounded container for content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    This is the default card style used for various UI elements
                    in the app.
                  </p>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              <div className="flex flex-col items-center justify-center p-4">
                <ImageFrame
                  src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=400&fit=crop"
                  caption="Beach Day 2026 🏖️"
                  rotation={-3}
                  className="w-64"
                />
              </div>

              <Card variant="polaroid" className="mx-auto max-w-75">
                <div className="bg-sand/10 border-border mb-4 flex aspect-square items-center justify-center rounded-sm border-2 border-dashed">
                  <Camera className="text-border h-12 w-12" />
                </div>
                <div className="font-handwritten text-center text-xl">
                  Polaroid Variant
                </div>
              </Card>
            </div>
          </section>

          {/* Inputs Section */}
          <section className="space-y-6">
            <div className="border-accent/20 border-b-2 pb-2 text-2xl font-bold">
              Forms & Inputs
            </div>
            <div className="grid max-w-3xl gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <label className="ml-2 text-sm font-bold">Your Nickname</label>
                <Input placeholder="Enter your name..." />
              </div>
              <div className="space-y-4">
                <label className="ml-2 text-sm font-bold">
                  Memory Description
                </label>
                <Textarea placeholder="What happened today?..." />
              </div>
            </div>
          </section>

          {/* Animations & Decorations */}
          <section className="space-y-6">
            <div className="border-accent/20 border-b-2 pb-2 text-2xl font-bold">
              Animations & Decorations
            </div>
            <div className="border-border flex flex-wrap items-center justify-around gap-12 rounded-3xl border-2 border-dashed bg-white/30 p-8">
              <Float>
                <div className="shadow-floating rounded-2xl bg-white p-4 text-center">
                  <span className="text-4xl">🎈</span>
                  <p className="mt-2 font-bold">Float Effect</p>
                </div>
              </Float>

              <Pop>
                <div className="bg-accent shadow-sticker cursor-pointer rounded-full border-4 border-white p-6 transition-transform hover:scale-110">
                  <Heart className="h-8 w-8 fill-white text-white" />
                </div>
              </Pop>

              <div className="shadow-soft relative flex h-24 w-40 items-center justify-center rounded-lg bg-white">
                <Tape rotation={-10} className="bg-primary/30" />
                <p className="font-handwritten text-lg">Tape Decor</p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  className="animate-bounce-slow rounded-full"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="animate-bounce-slow rounded-full"
                  style={{ animationDelay: '0.2s' }}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Interactions & Feedback */}
          <section className="space-y-6">
            <div className="border-accent/20 border-b-2 pb-2 text-2xl font-bold">
              Interactions & Feedback
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Modal Example */}
              <Card>
                <CardHeader>
                  <CardTitle>Modals & Dialogs</CardTitle>
                  <CardDescription>
                    Overlays for focused interactions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Modal
                    trigger={
                      <Button variant="outline">Open Simple Modal</Button>
                    }
                    title="Are you sure?"
                    description="This will permanently delete your memory and remove it from our servers."
                    footer={
                      <>
                        <Button variant="outline">Cancel</Button>
                        <Button className="bg-red-500 text-white hover:bg-red-600">
                          Delete
                        </Button>
                      </>
                    }
                  />

                  <Modal
                    trigger={<Button>Add Memory Modal</Button>}
                    title="Add New Memory"
                    description="Share a special moment from your trip."
                    contentClassName="sm:max-w-106.25"
                    footer={<Button type="submit">Save changes</Button>}
                  >
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Memory Title
                        </label>
                        <Input id="name" placeholder="Summer sunset..." />
                      </div>
                      <div className="grid gap-2">
                        <label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          Description
                        </label>
                        <Textarea
                          id="description"
                          placeholder="It was amazing..."
                        />
                      </div>
                    </div>
                  </Modal>
                </CardContent>
              </Card>

              {/* Toast Example */}
              <Card>
                <CardHeader>
                  <CardTitle>Toasts & Notifications</CardTitle>
                  <CardDescription>
                    Brief messages about app processes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: 'Memory Saved!',
                        description:
                          'Your new memory has been added to the scrapbook.',
                      });
                    }}
                  >
                    Default Toast
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        variant: 'destructive',
                        title: 'Uh oh! Something went wrong.',
                        description: 'There was a problem with your request.',
                      });
                    }}
                  >
                    Destructive Toast
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </section>

      <UploadFabButton onClick={() => alert('Ready to post!')} />
    </AppLayout>
  );
};

export default Home;
