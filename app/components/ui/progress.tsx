import { Progress } from "radix-ui";
import { cn } from "@/lib/utils";

export function ProgressBar({ value = 0, className }: { value?: number; className?: string }) {
  return (
    <Progress.Root
      value={value}
      className={cn(
        "relative w-full h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
        className
      )}
    >
      <Progress.Indicator
        className="h-full bg-gradient-to-r from-primary to-blue-500 transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />

    </Progress.Root>
  );
}
