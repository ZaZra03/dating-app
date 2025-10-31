/**
 * Chat bubble component for displaying styled chat messages.
 * Provides visual distinction between own messages and received messages.
 */

import { cn } from "@/lib/utils";

/**
 * Props for the ChatBubble component.
 */
interface ChatBubbleProps {
  message: string;
  isOwn: boolean;
  timestamp: string;
}

/**
 * Styled chat bubble component.
 * 
 * @param props - Component props
 * @param props.message - The message text to display
 * @param props.isOwn - Whether this is the current user's message
 * @param props.timestamp - Timestamp string to display below the message
 * 
 * Features:
 * - Gradient styling for own messages
 * - Card styling for received messages
 * - Timestamp display
 * - Responsive width (max 75% of container)
 */
export const ChatBubble = ({ message, isOwn, timestamp }: ChatBubbleProps) => {
  return (
    <div className={cn("flex w-full mb-4", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[75%] flex flex-col", isOwn ? "items-end" : "items-start")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm",
            isOwn
              ? "bg-gradient-spark text-primary-foreground rounded-br-md"
              : "bg-card text-card-foreground rounded-bl-md border border-border"
          )}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">{timestamp}</span>
      </div>
    </div>
  );
};
