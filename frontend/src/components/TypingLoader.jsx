import { cn } from "@/lib/utils";

export function TypingLoader({ className }) {
  return (
    <div
      className={cn("flex items-center gap-2 p-2", className)}
      aria-label="Typing indicator"
    >
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="bg-muted-foreground block h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
