"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  onRate: (rating: number) => void
  currentRating?: number
  readOnly?: boolean
  size?: number
}

export function StarRating({ onRate, currentRating = 0, readOnly = false, size = 20 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readOnly && onRate(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          className={`transition-colors ${!readOnly && "cursor-pointer"}`}
          disabled={readOnly}
        >
          <Star
            size={size}
            className={`${
              star <= (hoverRating || currentRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  )
}
