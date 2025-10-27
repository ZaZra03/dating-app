import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, User, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchCardProps {
  id: string;
  name: string;
  age: number;
  bio: string;
  photoUrl?: string;
  matchedAt: string;
  onChatClick: (id: string) => void;
  onUnmatch?: (id: string, name: string) => void;
}

export const MatchCard = ({
  id,
  name,
  age,
  bio,
  photoUrl,
  matchedAt,
  onChatClick,
  onUnmatch,
}: MatchCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-card transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-primary-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{name}</h3>
              <span className="text-sm text-muted-foreground">{age}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{bio}</p>
            <p className="text-xs text-muted-foreground">Matched {matchedAt}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onChatClick(id)}
              className="bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
            {onUnmatch && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onUnmatch(id, name)}
              >
                <UserX className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
