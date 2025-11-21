"use client"

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingInputProps {
  value: number
  onChange: (rating: number) => void
  maxRating?: number
  size?: number
  className?: string
}

export function StarRatingInput({
  value,
  onChange,
  maxRating = 5,
  size = 32,
  className = '',
}: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className={`flex gap-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const filled = starValue <= (hoverRating || value)

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={size}
              className={`${
                filled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              } transition-colors`}
            />
          </button>
        )
      })}
    </div>
  )
}
