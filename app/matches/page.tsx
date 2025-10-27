import { Button } from "@/components/ui/button";
import { MatchCard } from "@/components/MatchCard";
import { ArrowLeft, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockMatches = [
  {
    id: "1",
    name: "Jordan",
    age: 26,
    bio: "Adventure seeker 🏔️ | Foodie | Dog lover 🐕",
    matchedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "Sam",
    age: 24,
    bio: "Artist 🎨 | Coffee addict ☕ | Always creating something new",
    matchedAt: "Yesterday",
  },
  {
    id: "3",
    name: "Taylor",
    age: 27,
    bio: "Music producer 🎵 | Gym enthusiast 💪 | Weekend hiker",
    matchedAt: "3 days ago",
  },
];

const Matches = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [matches, setMatches] = useState(mockMatches);

  const handleChatClick = (matchId: string) => {
    // Navigate to chat with specific match
    router.push(`/chat?matchId=${matchId}`);
  };

  const handleUnmatch = (matchId: string, matchName: string) => {
    setMatches(prev => prev.filter(match => match.id !== matchId));
    toast({
      title: "Unmatched",
      description: `You've unmatched with ${matchName}. 💔`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center border-b border-border">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Spark</span>
        </div>
        <Button variant="ghost" onClick={() => router.push("/settings")} className="w-10">
          ⚙️
        </Button>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Your Matches</h1>
            <p className="text-muted-foreground text-lg">
              {matches.length} sparks found! 🔥
            </p>
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-6">
                No matches yet. Start chatting to find your spark! ✨
              </p>
            <Button
              onClick={() => router.push("/find-match")}
              className="bg-primary hover:bg-primary/90"
            >
              Find a Match
            </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  {...match}
                  onChatClick={handleChatClick}
                  onUnmatch={handleUnmatch}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
          <Button
            size="lg"
            onClick={() => router.push("/find-match")}
            className="bg-primary hover:bg-primary/90"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Find Another Match
          </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Matches;
