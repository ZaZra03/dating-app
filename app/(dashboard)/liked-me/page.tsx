"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, User, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { withAuth } from "@/lib/withAuth";

const LikedMe = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [likedMe, setLikedMe] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState<number | null>(null);

  useEffect(() => {
    const fetchLiked = async () => {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch('/api/liked-me', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setLikedMe(Array.isArray(data) ? data : []);
      } catch {
        setLikedMe([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  const handleLikeBack = async (userId: number) => {
    setLiking(userId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ toUserId: userId, direction: 'like' }),
      });
      const data = await res.json();
      setLikedMe(prev => prev.filter(user => user.id !== userId));
      if (data?.match) {
        toast({
          title: "It's a Match! 🎉",
          description: "You both like each other!",
        });
      } else {
        toast({
          title: 'Liked back',
          description: 'You liked this user.',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Could not like back, please try again.',
        variant: 'destructive',
      });
    } finally {
      setLiking(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-pink-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Likes For You</h1>
            {loading ? (
              <p className="text-muted-foreground text-lg">Loading...</p>
            ) : (
              <p className="text-muted-foreground text-lg">
                {likedMe.length} people like your profile! 💖
              </p>
            )}
          </div>
          {!loading && likedMe.length === 0 ? (
            <div className="text-center">
              <p className="text-muted-foreground text-lg">
                No likes yet. Start swiping and let the sparks fly! ✨
              </p>
              {/* <Button
                onClick={() => router.push("/discover")}
                className="bg-primary hover:bg-primary/90"
              >
                Discover Matches
              </Button> */}
            </div>
          ) : (
            <div className="space-y-4">
              {likedMe.map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      {user.photoUrl ? (
                        <img src={user.photoUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                      <span className="text-sm text-muted-foreground">{user.age}</span>
                      <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-pink-500 hover:bg-pink-700 text-white"
                      onClick={() => handleLikeBack(user.id)}
                      disabled={liking === user.id}
                    >
                      <Check className="w-4 h-4 mr-1" /> Like Back
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default withAuth(LikedMe);
