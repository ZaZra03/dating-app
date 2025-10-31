/**
 * Timer bar component for displaying countdown timers.
 * Shows remaining time with visual progress bar and low-time warnings.
 */

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props for the TimerBar component.
 */
interface TimerBarProps {
  totalSeconds: number;
  onTimeUp: () => void;
}

/**
 * Timer component that counts down from the total seconds and calls onTimeUp when finished.
 * 
 * @param props - Component props
 * @param props.totalSeconds - Initial time in seconds to count down from
 * @param props.onTimeUp - Callback function called when the timer reaches zero
 * 
 * Features:
 * - Visual progress bar showing remaining time percentage
 * - Low-time warning (changes color when <= 30 seconds)
 * - Animated clock icon when time is low
 * - Formatted time display (MM:SS)
 * - Automatic cleanup on unmount
 * 
 * Side effects:
 * - Sets up interval timer that decrements every second
 * - Calls onTimeUp callback when timer reaches zero
 * - Clears interval on component unmount
 */
export const TimerBar = ({ totalSeconds, onTimeUp }: TimerBarProps) => {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const percentage = (secondsLeft / totalSeconds) * 100;
  const isLowTime = secondsLeft <= 30;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  /**
   * Formats seconds into MM:SS format.
   * 
   * @param seconds - Number of seconds to format
   * @returns Formatted time string (e.g., "5:30")
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className={cn("w-4 h-4", isLowTime && "text-destructive animate-pulse-glow")} />
          <span
            className={cn(
              "text-sm font-semibold transition-colors",
              isLowTime ? "text-destructive" : "text-foreground"
            )}
          >
            {formatTime(secondsLeft)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {isLowTime ? "Time's almost up! ⚡" : "Chat away! 💬"}
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-linear",
            isLowTime ? "bg-destructive animate-pulse-glow" : "bg-gradient-spark"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
