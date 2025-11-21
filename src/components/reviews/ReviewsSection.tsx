"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import { StarRating } from './StarRating'
import { ReviewForm } from './ReviewForm'
import { Button } from '@/components/ui/button'
import { Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'

interface Review {
  id: string
  propertyId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    name: string
    imageUrl: string
  }
}

interface ReviewsSectionProps {
  propertyId: string
}

export function ReviewsSection({ propertyId }: ReviewsSectionProps) {
  const { userId } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [propertyId])

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${propertyId}`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews)
        setAverageRating(data.averageRating)
        setReviewCount(data.reviewCount)

        // Check if current user has reviewed
        if (userId) {
          const userReview = data.reviews.find((r: Review) => r.userId === userId)
          setHasReviewed(!!userReview)
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const res = await fetch(`/api/reviews/review/${reviewId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Review deleted successfully')
        fetchReviews()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('An error occurred')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={averageRating} size={24} showNumber />
              <span className="text-gray-600">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>

        {userId && !hasReviewed && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Write a Review'}
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && userId && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
          <ReviewForm
            propertyId={propertyId}
            onSuccess={() => {
              setShowForm(false)
              fetchReviews()
            }}
          />
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No reviews yet. Be the first to review this property!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {/* User Avatar */}
                  {review.user.imageUrl ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={review.user.imageUrl}
                        alt={review.user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-gray-600">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.user.name}</p>
                        <StarRating rating={review.rating} size={16} />
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>

                {/* Delete button for own reviews */}
                {userId === review.userId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
