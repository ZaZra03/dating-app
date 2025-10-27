import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/ChatBubble";
import { TimerBar } from "@/components/TimerBar";
import { ArrowLeft, Send, Heart, X, Sparkles, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: string;
}

const Chat = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const [hasAccess, setHasAccess] = useState(!!matchId);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! Great to meet you! 👋",
      isOwn: false,
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const partnerName = "Jordan";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTimeUp) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isOwn: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate partner response
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more 😊",
        "I totally agree!",
        "Haha, that's funny! 😄",
        "Really? I love that too!",
        "This is such a great conversation!",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          isOwn: false,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setShowDecision(true);
    toast({
      title: "Time's Up! ⏰",
      description: "Did you feel a spark?",
    });
  };

  const handleSpark = () => {
    // Simulate partner also choosing spark (50% chance)
    const partnerSpark = Math.random() > 0.5;
    router.push(`/spark-result?match=${partnerSpark}`);
  };

  const handleEnd = () => {
    router.push("/spark-result?match=false");
  };

  // If no access (no matchId), show locked state
  if (!hasAccess) {
    return (
      <div className="h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold">Chat Locked</h2>
          <p className="text-muted-foreground text-lg">
            You can only chat with your mutual matches ❤️
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/matches")}
              className="flex-1"
            >
              View Matches
            </Button>
            <Button
              onClick={() => router.push("/discover")}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Find Matches
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-foreground">
              {partnerName[0]}
            </span>
          </div>
          <span className="font-semibold">{partnerName}</span>
        </div>
        <div className="w-8" />
      </header>

      {/* Timer */}
      <div className="bg-card px-4 py-3 border-b border-border">
        <TimerBar totalSeconds={180} onTimeUp={handleTimeUp} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.text}
            isOwn={message.isOwn}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />

        {/* Match Celebration */}
        {isMatched && (
          <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50 animate-match-celebration">
            <div className="text-center space-y-6 p-8">
              <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                <Sparkles className="w-16 h-16 text-primary-foreground" />
              </div>
              <h2 className="text-4xl font-bold">It's a Match! 🎉</h2>
              <p className="text-xl text-muted-foreground">
                You and {partnerName} both felt the spark!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Decision Buttons (when time is up) */}
      {showDecision && !isMatched && (
        <div className="bg-card px-4 py-6 border-t border-border animate-slide-up">
          <div className="space-y-4">
            <p className="text-center font-semibold text-lg">Did you feel a spark? ✨</p>
            <div className="flex gap-4">
              <Button
                onClick={handleEnd}
                variant="outline"
                className="flex-1 h-14 text-lg"
              >
                <X className="w-5 h-5 mr-2" />
                End Chat
              </Button>
              <Button
                onClick={handleSpark}
                className="flex-1 h-14 text-lg bg-primary hover:bg-primary/90"
              >
                <Heart className="w-5 h-5 mr-2" />
                Spark!
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input (when time is running) */}
      {!isTimeUp && (
        <form
          onSubmit={handleSendMessage}
          className="bg-card px-4 py-4 border-t border-border"
        >
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isTimeUp}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-primary hover:bg-primary/90"
              disabled={!inputValue.trim() || isTimeUp}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Chat;
