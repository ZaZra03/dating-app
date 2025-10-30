"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Heart,
  X,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { withAuth } from "@/lib/withAuth";

const mockProfiles = [
  {
    id: 1,
    name: "Alex",
    age: 26,
    bio: "Coffee enthusiast ☕ | Love hiking and live music 🎵",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Jordan",
    age: 24,
    bio: "Artist 🎨 | Looking for genuine connections and fun conversations",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Taylor",
    age: 28,
    bio: "Foodie and travel lover 🌍 | Always up for adventures",
    photo:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Casey",
    age: 25,
    bio: "Dog mom 🐕 | Yoga instructor | Sunset chaser 🌅",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
  },
];

const Discover = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [ageRange, setAgeRange] = useState([18]);
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

          if (
            localStorage.getItem("notifications") !== "false" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
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
      <div className="flex flex-col h-full items-center justify-center px-6">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-semibold">No more profiles</h2>
          <p className="text-muted-foreground">
            Check back later for new connections!
          </p>
          <Button
            onClick={() => router.push("/matches")}
            className="bg-primary hover:bg-primary/90"
          >
            View Matches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with sidebar trigger and filters */}
      {/* Filters - Desktop */}
      <div className="hidden lg:block px-6 py-6 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Age Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground/80">
                Age Range
              </Label>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{ageRange[0]}</span>
              </div>
              <Slider
                min={18}
                max={60}
                step={1}
                value={ageRange}
                onValueChange={setAgeRange}
              />
            </div>

            {/* Distance Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground/80">
                Distance
              </Label>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0 km</span>
                <span>{distance[0]} km</span>
              </div>
              <Slider
                min={1}
                max={100}
                step={1}
                value={distance}
                onValueChange={setDistance}
              />
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <main className="flex-1 px-4 py-10 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-md">
          <Card
            className={`relative overflow-hidden rounded-2xl shadow-md border border-border transition-all duration-300 transform ${direction === "left"
                ? "opacity-0 -translate-x-full rotate-12"
                : direction === "right"
                  ? "opacity-0 translate-x-full -rotate-12"
                  : "opacity-100 translate-x-0 rotate-0"
              }`}
          >
            <div className="relative h-[26rem]">
              <img
                src={currentProfile.photo}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                <h2 className="text-3xl font-bold text-white mb-1">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <p className="text-sm text-gray-200">
                  {currentProfile.bio}
                </p>
              </div>
            </div>
            <div className="p-6 flex justify-center gap-8">
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-destructive/60 hover:text-destructive transition"
                onClick={() => handleSwipe(false)}
              >
                <X className="w-8 h-8" />
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 transition"
                onClick={() => handleSwipe(true)}
              >
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
  );
};

export default withAuth(Discover);
