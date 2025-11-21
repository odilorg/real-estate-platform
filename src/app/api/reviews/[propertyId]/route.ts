import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getDataStore } from '@/lib/dataStore'

// GET reviews for a property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params
    const dataStore = getDataStore()

    const reviews = dataStore.getReviewsByPropertyId(propertyId)
    const averageRating = dataStore.getAverageRating(propertyId)

    // Enrich reviews with user info
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        try {
          const client = await clerkClient()
          const user = await client.users.getUser(review.userId)
          return {
            ...review,
            user: {
              id: user.id,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
              imageUrl: user.imageUrl,
            },
          }
        } catch (error) {
          console.error('Error fetching user:', error)
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
    const { userId } = await auth()
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

    const dataStore = getDataStore()

    // Check if property exists
    const property = dataStore.getPropertyById(propertyId)
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Check if user already reviewed this property
    if (dataStore.hasUserReviewedProperty(userId, propertyId)) {
      return NextResponse.json(
        { error: 'You have already reviewed this property' },
        { status: 400 }
      )
    }

    // Create review
    const review = dataStore.createReview({
      propertyId,
      userId,
      rating,
      comment: comment.trim(),
      approved: true,
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
