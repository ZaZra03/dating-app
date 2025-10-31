"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Heart, X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { withAuth } from "@/lib/withAuth";
import { motion, useAnimation } from "framer-motion";

const Discover = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentProfile, setCurrentProfile] = useState<any | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [ageRange, setAgeRange] = useState([18]);
  const [distance, setDistance] = useState([50]);
  const [generalIndex, setGeneralIndex] = useState(1);
  const [isFilteredOut, setIsFilteredOut] = useState(false);
  const controls = useAnimation();

  const fetchNextProfile = async () => {
    setPending(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const minAge = ageRange[0] ?? 18;
      const maxAge = 60; // slider max
      const res = await fetch(`/api/swipe/next?ageMin=${minAge}&ageMax=${maxAge}`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data?.done) {
        setCurrentProfile(null);
        // Check if this is due to filtering or truly no more profiles
        // A filter is active if the minimum age is above the default (18)
        const currentMinAge = ageRange[0] ?? 18;
        const isFiltered = currentMinAge > 18;
        setDone(true);
        setIsFilteredOut(isFiltered);
      } else {
        setCurrentProfile(data);
        setIsFilteredOut(false);
        setDone(false);
      }
    } catch {
      setCurrentProfile(null);
      setDone(true);
      setIsFilteredOut(true); // Assume filtered if error
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    fetchNextProfile();
    // eslint-disable-next-line
  }, []);

  // Refetch when age filter changes
  useEffect(() => {
    fetchNextProfile();
    // eslint-disable-next-line
  }, [ageRange]);

  const swipeAndAnimate = async (liked: boolean, velocity = 800) => {
    if (!currentProfile || pending) return;
    setPending(true);
    setDirection(liked ? "right" : "left");
    // Animate card out
    await controls.start({
      x: liked ? 500 : -500,
      opacity: 0,
      transition: { duration: 0.25, velocity }
    });
    await handleSwipe(liked, false); // pass false so we don't animate again from the button(click) handler
    controls.set({x:0, opacity:1});
  };

  // This is your swipe action (shared logic, allow animate = true for button, false for drag)
  const handleSwipe = async (liked: boolean, animate = true) => {
    if (!currentProfile) return;
    if (animate) {
      swipeAndAnimate(liked);
      return;
    }
    setDirection(liked ? "right" : "left");
    setPending(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ toUserId: currentProfile.id, direction: liked ? "like" : "skip" }),
      });
      const result = await res.json();
      setTimeout(() => {
        setDirection(null);
        setGeneralIndex((idx) => idx + 1);
        fetchNextProfile();
        if (liked && result?.match) {
          toast({
            title: "It's a Match! 🎉",
            description: `You and ${currentProfile.name || 'this person'} liked each other!`,
          });
          if (
            localStorage.getItem("notifications") !== "false" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("New Match!", {
              body: `You matched with ${currentProfile.name || 'a new user'}!`,
              icon: currentProfile.photoUrl || undefined,
            });
          }
        }
      }, 300);
    } catch {
      toast({
        title: "Could not swipe",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setPending(false);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    if (pending) return;
    if (info.offset.x > 120) {
      swipeAndAnimate(true, info.velocity.x);
    } else if (info.offset.x < -120) {
      swipeAndAnimate(false, info.velocity.x);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  if (pending && !currentProfile && !done) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-6">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (done || !currentProfile) {
    return (
      <div className="flex flex-col h-full">
        {/* Filters - Always show when filtering (desktop and mobile) */}
        <div className="px-6 py-6 border-b border-border bg-background/80 backdrop-blur-sm">
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

        {/* No Results Content */}
        <div className="flex flex-col h-full items-center justify-center px-6">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-semibold">
              {isFilteredOut ? "No profiles match your filter" : "No more profiles"}
            </h2>
            <p className="text-muted-foreground">
              {isFilteredOut
                ? "Try adjusting your age filter to see more profiles."
                : "Check back later for new connections!"}
            </p>
            <div className="flex gap-3 justify-center">
              {isFilteredOut && (
                <Button
                  onClick={() => setAgeRange([18])}
                  className="bg-primary hover:bg-primary/90">
                  Reset Filter
                </Button>
              )}
              <Button
                onClick={() => router.push("/matches")}
                className="bg-primary hover:bg-primary/90">
                View Matches
              </Button>
            </div>
          </div>
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
          <motion.div
            drag={pending ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            animate={controls}
            onDragEnd={handleDragEnd}
            className={`relative overflow-hidden rounded-2xl shadow-md border border-border transition-all duration-300 transform ${direction === 'left'
              ? 'opacity-0 -translate-x-full rotate-12'
              : direction === 'right'
                ? 'opacity-0 translate-x-full -rotate-12'
                : 'opacity-100 translate-x-0 rotate-0'
              }`}
            style={{ touchAction: 'pan-y', background: 'white' }}
          >
            <div className="relative h-[26rem]">
              <img
                src={currentProfile.photoUrl || "/default-profile.png"}
                alt={currentProfile.name || 'Profile photo'}
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
                disabled={pending}
              >
                <X className="w-8 h-8" />
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 transition"
                onClick={() => handleSwipe(true)}
                disabled={pending}
              >
                <Heart className="w-8 h-8" fill="currentColor" />
              </Button>
            </div>
          </motion.div>
          <div className="text-center mt-4 text-sm text-muted-foreground">
            {generalIndex} 
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAuth(Discover);
