"use client"

import { useState, useEffect } from 'react'
import { StarRating } from '@/components/reviews/StarRating'

interface PropertyRatingProps {
  propertyId: string
}

export function PropertyRating({ propertyId }: PropertyRatingProps) {
  const [rating, setRating] = useState<{ average: number; count: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRating()
  }, [propertyId])

  const fetchRating = async () => {
    try {
      const res = await fetch(`/api/reviews/${propertyId}`)
      if (res.ok) {
        const data = await res.json()
        setRating({ average: data.averageRating, count: data.reviewCount })
      }
    } catch (error) {
      console.error('Error fetching rating:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !rating || rating.count === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-1">
      <StarRating rating={rating.average} size={16} showNumber />
      <span className="text-xs text-gray-500">({rating.count})</span>
    </div>
  )
}
