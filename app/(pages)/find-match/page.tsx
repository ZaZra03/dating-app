"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Sparkles } from "lucide-react";

const FindMatch = () => {
  const router = useRouter();

  useEffect(() => {
    // Mock delay for finding match (3-5 seconds)
    const timer = setTimeout(() => {
      router.push("/chat");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-romantic flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* Animated Hearts */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-24 h-24 text-primary animate-pulse-glow" fill="currentColor" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-ping">
            <Heart className="w-24 h-24 text-primary opacity-30" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Finding Your{" "}
            <span className="bg-gradient-spark bg-clip-text text-transparent">Spark</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Searching for someone special... ✨
          </p>
        </div>

        {/* Sparkles Animation */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <Sparkles
              key={i}
              className="w-6 h-6 text-secondary animate-pulse-glow"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindMatch;
