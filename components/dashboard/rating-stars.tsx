"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number | null;
  onRate: (value: number) => void;
}

export function RatingStars({ rating, onRate }: RatingStarsProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className="focus:outline-none"
        >
          <Star
            className={cn(
              "h-4 w-4",
              rating && star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}