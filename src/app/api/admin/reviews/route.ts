import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAdminReviews, approveReview, rejectReview, logAdminAction } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const approvedParam = searchParams.get('approved')
    const approved = approvedParam === null ? undefined : approvedParam === 'true'

    const reviews = await getAdminReviews({ approved })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching admin reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { reviewId, action } = await request.json()

    if (!reviewId || !action) {
      return NextResponse.json({ error: 'Review ID and action required' }, { status: 400 })
    }

    if (action === 'approve') {
      await approveReview(reviewId)
      await logAdminAction({
        adminId: userId,
        action: 'APPROVE_REVIEW',
        targetType: 'REVIEW',
        targetId: reviewId,
      })
    } else if (action === 'reject') {
      await rejectReview(reviewId)
      await logAdminAction({
        adminId: userId,
        action: 'REJECT_REVIEW',
        targetType: 'REVIEW',
        targetId: reviewId,
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error moderating review:', error)
    return NextResponse.json(
      { error: 'Failed to moderate review' },
      { status: 500 }
    )
  }
}
