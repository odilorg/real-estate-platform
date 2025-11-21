"use client"

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  showNumber?: boolean
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  showNumber = false,
  className = '',
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const filled = starValue <= rating
        const partialFill = starValue > rating && starValue - 1 < rating

        return (
          <Star
            key={index}
            size={size}
            className={`${
              filled
                ? 'fill-yellow-400 text-yellow-400'
                : partialFill
                ? 'fill-yellow-200 text-yellow-400'
                : 'fill-gray-200 text-gray-300'
            }`}
          />
        )
      })}
      {showNumber && (
        <span className="ml-1 text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
