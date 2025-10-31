"use client"

import { Button } from "@/components/ui/button";
import { MatchCard } from "@/components/MatchCard";
import { ArrowLeft, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Matches = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch('/api/matches', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setMatches(Array.isArray(data) ? data : []);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleChatClick = (matchId: string) => {
    // Mark that we arrived via Matches and remember the matchId
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('openedFrom', 'matches');
        localStorage.setItem('currentMatchId', String(matchId));
      }
    } catch {}
    // Navigate to chat with specific match
    router.push(`/chat?matchId=${matchId}`);
  };

  const handleUnmatch = (matchId: string, matchName: string) => {
    setMatches(prev => prev.filter(match => `${match.id}` !== `${matchId}`));
    toast({
      title: "Unmatched",
      description: `You've unmatched with ${matchName}. 💔`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Your Matches</h1>
            {loading ? (
              <p className="text-muted-foreground text-lg">Loading...</p>
            ) : (
              <p className="text-muted-foreground text-lg">
                {matches.length} sparks found! 🔥
              </p>
            )}
            {/* <div className="mt-12 text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/find-match")}
                className="hover:bg-black hover:text-white transition-colors duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Find Another Match
              </Button>
            </div> */}
          </div>

          {!loading && matches.length === 0 ? (
            <div className="text-center">
              <p className="text-muted-foreground text-lg">
                No matches yet. Start chatting to find your spark! ✨
              </p>
              {/* <Button
                onClick={() => router.push("/find-match")}
                className="bg-primary hover:bg-primary/90"
              >
                Find a Match
              </Button> */}
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  id={String(match.id)}
                  name={match.name}
                  age={match.age}
                  bio={match.bio}
                  photoUrl={match.photoUrl}
                  matchedAt={new Date(match.matchedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  onChatClick={handleChatClick}
                  onUnmatch={handleUnmatch}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Matches;
