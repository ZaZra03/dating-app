"use client";

import { Button } from "@/components/ui/button";
import { Heart, Sparkles, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SparkResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMatch = searchParams.get("match") === "true";
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isMatch) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isMatch]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              <Heart
                className="text-pink-500 opacity-80"
                size={Math.random() * 20 + 10}
                fill="currentColor"
              />
            </div>
          ))}
        </div>
      )}

      <div className="text-center space-y-8 max-w-md relative z-10">
        {isMatch ? (
          <>
            {/* Match Success */}
            <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-rose-400 rounded-full flex items-center justify-center mx-auto shadow-lg animate-[scaleUp_0.4s_ease-out]">
              <Heart className="w-16 h-16 text-white animate-pulse" fill="currentColor" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold animate-[slideUp_0.6s_ease-out]">
                It's a Match! 🎉
              </h1>
              <p className="text-xl text-gray-600">
                You both felt the spark! Keep the conversation going ✨
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/matches")}
                className="hover:bg-black hover:text-white transition-colors duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                View Matches
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/find-match")}
                className="hover:bg-black hover:text-white transition-colors duration-300"
              >
                Find Another Match
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* No Match */}
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto animate-[scaleUp_0.4s_ease-out]">
              <X className="w-16 h-16 text-gray-800" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold animate-[slideUp_0.6s_ease-out]">
                No Spark This Time 💔
              </h1>
              <p className="text-xl text-gray-600">
                Don't worry! Your perfect match is just around the corner.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/find-match")}
                className="hover:bg-black hover:text-white transition-colors duration-300"
              >
                <Heart className="w-5 h-5 mr-2" />
                Find New Match
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/matches")}
                className="hover:bg-black hover:text-white transition-colors duration-300"
              >
                View Matches
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SparkResult;
