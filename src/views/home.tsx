import React from 'react';
import { Camera, MapPin, Sun, Moon, Heart, MessageCircle, Share2, Star } from 'lucide-react';
import { AppLayout, MasonryGrid } from '@/components/layout/layout-primitives';
import { MemoryPostCard } from '@/components/memory/memory-post-card';
import { UploadFabButton } from '@/components/memory/upload-fab-button';
import { Float, Tape, Pop } from '@/components/animation/animation-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ImageFrame } from '@/components/ui/image-frame';
import { Divider } from '@/components/ui/divider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme/theme-provider';

const Home: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  return (
    <AppLayout
      header={
        <header className="text-center space-y-4 relative">
          <div className="absolute top-0 right-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'summer' ? 'sunset' : 'summer')}
              className="rounded-full"
            >
              {theme === 'summer' ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
            </Button>
          </div>
          <Float>
            <div className="inline-block relative">
              <Tape rotation={-3}/>
              <h1 className="text-5xl md:text-7xl font-bold text-accent drop-shadow-sm">
                Memory Trip
              </h1>
            </div>
          </Float>
          <p className="font-handwritten text-2xl text-text max-w-md mx-auto">
            "Our shared scrapbook of the best summer ever!"
          </p>
        </header>
      }
      footer={
        <footer
          className="max-w-2xl mx-auto w-full flex justify-between items-center bg-white/40 backdrop-blur-sm p-6 rounded-3xl border-2 border-dashed border-border">
          <div className="flex items-center gap-2">
            <MapPin className="text-accent"/>
            <span className="font-rounded font-bold">12 Places Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="text-secondary"/>
            <span className="font-rounded font-bold">48 Memories</span>
          </div>
          <Badge variant="nickname">
            Team Summer '26
          </Badge>
        </footer>
      }
    >
      <section className="space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Star className="text-accent fill-accent"/> Recent Memories
          </h2>
          <MasonryGrid>
            <MemoryPostCard
              imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
              title="Sunset at the beach! 🌴"
              author="Junie"
              date="Aug 12, 2026"
              tags={["beach", "sunset"]}
              rotation={2}
            />
            <MemoryPostCard
              imageUrl="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
              title="Night market snacks 🍡"
              author="Alex"
              date="Aug 13, 2026"
              tags={["food", "market"]}
              rotation={-3}
            />
            <MemoryPostCard
              imageUrl="https://plus.unsplash.com/premium_photo-1766850624403-5aa9935778ef?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              title="Blue Sky"
              author="Sam"
              date="Aug 14, 2026"
              tags={["pool", "chill"]}
              rotation={1}
            />
          </MasonryGrid>
        </div>

        <Divider variant="dashed" className="my-16"/>

        <div className="space-y-16 pb-20">
          <header className="text-center">
            <Badge variant="nickname" className="mb-2">UI Component Library</Badge>
            <h2 className="text-4xl font-bold">Design System Showcase</h2>
            <p className="font-handwritten text-xl text-text/60 mt-2">Check out all our cute summer components!</p>
          </header>

          {/* Buttons Section */}
          <section className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-accent/20 pb-2">Buttons & Interaction</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent Color</Button>
              <Button variant="outline">Outline Style</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="sticker" size="sticker">Sticker Button!</Button>
              <Button variant="sticker" size="sticker" className="bg-coral">Sticker Coral</Button>
            </div>
          </section>

          {/* Badges & Avatars */}
          <section className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold border-b-2 border-accent/20 pb-2">Badges</h3>
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
              <h3 className="text-2xl font-bold border-b-2 border-accent/20 pb-2">Avatars</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png"/>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="h-12 w-12 border-secondary">
                  <AvatarFallback className="bg-mint/30 text-secondary">AM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"/>
                </Avatar>
              </div>
            </div>
          </section>

          {/* Cards & Frames */}
          <section className="space-y-8">
            <h3 className="text-2xl font-bold border-b-2 border-accent/20 pb-2">Cards & Scrapbook Elements</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>A cozy rounded container for content.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">This is the default card style used for various UI elements in the app.</p>
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

              <Card variant="polaroid" className="max-w-75 mx-auto">
                <div
                  className="aspect-square bg-sand/10 rounded-sm mb-4 flex items-center justify-center border-2 border-dashed border-border">
                  <Camera className="w-12 h-12 text-border"/>
                </div>
                <h4 className="font-handwritten text-xl text-center">Polaroid Variant</h4>
              </Card>
            </div>
          </section>

          {/* Inputs Section */}
          <section className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-accent/20 pb-2">Forms & Inputs</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
              <div className="space-y-4">
                <label className="font-bold text-sm ml-2">Your Nickname</label>
                <Input placeholder="Enter your name..."/>
              </div>
              <div className="space-y-4">
                <label className="font-bold text-sm ml-2">Memory Description</label>
                <Textarea placeholder="What happened today?..."/>
              </div>
            </div>
          </section>

          {/* Animations & Decorations */}
          <section className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-accent/20 pb-2">Animations & Decorations</h3>
            <div
              className="flex flex-wrap gap-12 items-center justify-around p-8 bg-white/30 rounded-3xl border-2 border-dashed border-border">
              <Float>
                <div className="text-center p-4 bg-white rounded-2xl shadow-floating">
                  <span className="text-4xl">🎈</span>
                  <p className="font-bold mt-2">Float Effect</p>
                </div>
              </Float>

              <Pop>
                <div
                  className="bg-accent p-6 rounded-full shadow-sticker border-4 border-white cursor-pointer hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white fill-white"/>
                </div>
              </Pop>

              <div className="relative w-40 h-24 bg-white shadow-soft rounded-lg flex items-center justify-center">
                <Tape rotation={-10} className="bg-primary/30"/>
                <p className="font-handwritten text-lg">Tape Decor</p>
              </div>

              <div className="flex gap-2">
                <Button size="icon" className="rounded-full animate-bounce-slow">
                  <Share2 className="w-4 h-4"/>
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full animate-bounce-slow"
                        style={{ animationDelay: '0.2s' }}>
                  <MessageCircle className="w-4 h-4"/>
                </Button>
              </div>
            </div>
          </section>

          {/* Interactions & Feedback */}
          <section className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-accent/20 pb-2">Interactions & Feedback</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Modal Example */}
              <Card>
                <CardHeader>
                  <CardTitle>Modals & Dialogs</CardTitle>
                  <CardDescription>Overlays for focused interactions.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Open Simple Modal</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This will permanently delete your memory and remove it from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white">Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Memory Modal</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-106.25">
                      <DialogHeader>
                        <DialogTitle>Add New Memory</DialogTitle>
                        <DialogDescription>
                          Share a special moment from your trip.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label htmlFor="name" className="text-sm font-medium">Memory Title</label>
                          <Input id="name" placeholder="Summer sunset..."/>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="description" className="text-sm font-medium">Description</label>
                          <Textarea id="description" placeholder="It was amazing..."/>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Toast Example */}
              <Card>
                <CardHeader>
                  <CardTitle>Toasts & Notifications</CardTitle>
                  <CardDescription>Brief messages about app processes.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Memory Saved!",
                        description: "Your new memory has been added to the scrapbook.",
                      })
                    }}
                  >
                    Default Toast
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                      })
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

      <UploadFabButton onClick={() => alert("Ready to post!")}/>
    </AppLayout>
  );
};

export default Home;
