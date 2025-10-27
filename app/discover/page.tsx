import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Heart, X, Settings, Sparkles, MessageCircle, Users, Compass, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const mockProfiles = [
  {
    id: 1,
    name: "Alex",
    age: 26,
    bio: "Coffee enthusiast ☕ | Love hiking and live music 🎵",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Jordan",
    age: 24,
    bio: "Artist 🎨 | Looking for genuine connections and fun conversations",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Taylor",
    age: 28,
    bio: "Foodie and travel lover 🌍 | Always up for adventures",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Casey",
    age: 25,
    bio: "Dog mom 🐕 | Yoga instructor | Sunset chaser 🌅",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
  },
];

const Discover = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [distance, setDistance] = useState([50]);

  const currentProfile = mockProfiles[currentIndex];

  const handleSwipe = (liked: boolean) => {
    setDirection(liked ? "right" : "left");

    setTimeout(() => {
      if (currentIndex < mockProfiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);

        if (liked && Math.random() > 0.5) {
          toast({
            title: "It's a Match! 🎉",
            description: `You and ${currentProfile.name} liked each other!`,
          });
          
          if (localStorage.getItem("notifications") !== "false" && "Notification" in window && Notification.permission === "granted") {
            new Notification("New Match!", {
              body: `You matched with ${currentProfile.name}!`,
              icon: currentProfile.photo,
            });
          }
        }
      } else {
        toast({
          title: "That's everyone for now!",
          description: "Check back later for more connections ✨",
        });
        router.push("/matches");
      }
    }, 300);
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold">No more profiles</h2>
          <p className="text-muted-foreground">Check back later for new connections!</p>
          <Button onClick={() => router.push("/matches")} className="bg-primary hover:bg-primary/90">
            View Matches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Spark</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start bg-muted">
            <Compass className="w-5 h-5 mr-3" />
            Discover
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/matches")}>
            <Users className="w-5 h-5 mr-3" />
            Matches
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/chat")}>
            <MessageCircle className="w-5 h-5 mr-3" />
            Chat
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/settings")}>
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="px-4 py-4 flex justify-between items-center border-b border-border lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Discover</span>
          </div>
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-3">
                    <Label>Age Range: {ageRange[0]} - {ageRange[1]}</Label>
                    <Slider min={18} max={60} step={1} value={ageRange} onValueChange={setAgeRange} />
                  </div>
                  <div className="space-y-3">
                    <Label>Distance: {distance[0]} km</Label>
                    <Slider min={1} max={100} step={1} value={distance} onValueChange={setDistance} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="hidden lg:block px-6 py-4 border-b border-border">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-sm font-semibold">Filters</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs">Age: {ageRange[0]} - {ageRange[1]}</Label>
                <Slider min={18} max={60} step={1} value={ageRange} onValueChange={setAgeRange} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Distance: {distance[0]} km</Label>
                <Slider min={1} max={100} step={1} value={distance} onValueChange={setDistance} />
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className={`relative overflow-hidden transition-all duration-300 border border-border ${
              direction === "left" ? "opacity-0 -translate-x-full rotate-12" :
              direction === "right" ? "opacity-0 translate-x-full -rotate-12" :
              "opacity-100 translate-x-0 rotate-0"
            }`}>
              <div className="relative h-96 bg-gradient-to-b from-background/0 to-background">
                <img src={currentProfile.photo} alt={currentProfile.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
                  <h2 className="text-3xl font-bold mb-1">{currentProfile.name}, {currentProfile.age}</h2>
                  <p className="text-muted-foreground">{currentProfile.bio}</p>
                </div>
              </div>
              <div className="p-6 flex justify-center gap-6">
                <Button size="lg" variant="outline" className="w-16 h-16 rounded-full" onClick={() => handleSwipe(false)}>
                  <X className="w-8 h-8" />
                </Button>
                <Button size="lg" className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90" onClick={() => handleSwipe(true)}>
                  <Heart className="w-8 h-8" fill="currentColor" />
                </Button>
              </div>
            </Card>
            <div className="text-center mt-4 text-sm text-muted-foreground">
              {currentIndex + 1} / {mockProfiles.length}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discover;
