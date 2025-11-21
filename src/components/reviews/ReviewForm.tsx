"use client"

import { useState } from 'react'
import { StarRatingInput } from './StarRatingInput'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ReviewFormProps {
  propertyId: string
  onSuccess?: () => void
}

export function ReviewForm({ propertyId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a comment')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`/api/reviews/${propertyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Review submitted successfully!')
        setRating(0)
        setComment('')
        onSuccess?.()
      } else {
        toast.error(data.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this property..."
          rows={4}
          disabled={submitting}
        />
      </div>

      <Button type="submit" disabled={submitting || rating === 0 || !comment.trim()}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}
