"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteReviewButtonProps {
  reviewId: string
}

export function DeleteReviewButton({ reviewId }: DeleteReviewButtonProps) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const res = await fetch(`/api/reviews/review/${reviewId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Review deleted successfully')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('An error occurred')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
      {deleting ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
