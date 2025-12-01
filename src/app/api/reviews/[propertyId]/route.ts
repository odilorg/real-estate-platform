import { getSession, getUserById } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { getReviewsByPropertyId, getAverageRating, getPropertyById, hasUserReviewedProperty, createReview } from '@/lib/db'

// GET reviews for a property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params

    const reviews = await getReviewsByPropertyId(propertyId)
    const averageRating = await getAverageRating(propertyId)

    // Enrich reviews with user info
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        try {
          const user = await getUserById(review.userId)
          if (user) {
            return {
              ...review,
              user: {
                id: user.id,
                name: user.name || 'Anonymous',
                imageUrl: user.image,
              },
            }
          }
          return {
            ...review,
            user: {
              id: review.userId,
              name: 'Unknown User',
              imageUrl: '',
            },
          }
        } catch (error) {
          return {
            ...review,
            user: {
              id: review.userId,
              name: 'Unknown User',
              imageUrl: '',
            },
          }
        }
      })
    )

    return NextResponse.json({
      reviews: enrichedReviews,
      averageRating: averageRating.average,
      reviewCount: averageRating.count,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST create a new review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const session = await getSession()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { propertyId } = await params
    const { rating, comment } = await request.json()

    // Validate input
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      )
    }

    // Check if property exists
    const property = await getPropertyById(propertyId)
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Check if user already reviewed this property
    if (await hasUserReviewedProperty(userId, propertyId)) {
      return NextResponse.json(
        { error: 'You have already reviewed this property' },
        { status: 400 }
      )
    }

    // Create review
    const review = await createReview({
      propertyId,
      userId,
      rating,
      comment: comment.trim(),
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      )
    }

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
