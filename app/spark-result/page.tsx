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
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isMatch]);

  return (
    <div className="min-h-screen bg-gradient-romantic flex items-center justify-center px-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-match-celebration"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              <Heart
                className="text-primary"
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
            <div className="w-32 h-32 bg-gradient-spark rounded-full flex items-center justify-center mx-auto shadow-spark animate-scale-in">
              <Heart className="w-16 h-16 text-primary-foreground animate-pulse-glow" fill="currentColor" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold animate-slide-up">
                It's a Match! 🎉
              </h1>
              <p className="text-xl text-muted-foreground">
                You both felt the spark! Keep the conversation going ✨
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => router.push("/matches")}
                className="bg-gradient-spark shadow-spark hover:opacity-90"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                View Matches
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/find-match")}
              >
                Find Another Match
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* No Match */}
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto animate-scale-in">
              <X className="w-16 h-16 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold animate-slide-up">
                No Spark This Time 💔
              </h1>
              <p className="text-xl text-muted-foreground">
                Don't worry! Your perfect match is just around the corner.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => router.push("/find-match")}
                className="bg-gradient-spark shadow-spark hover:opacity-90"
              >
                <Heart className="w-5 h-5 mr-2" />
                Find New Match
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/matches")}
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
