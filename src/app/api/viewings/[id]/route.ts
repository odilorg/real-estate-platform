import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getViewingById, updateViewingStatus } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/viewings/[id] - Get single viewing
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const viewing = await getViewingById(id)

    if (!viewing) {
      return NextResponse.json(
        { error: 'Viewing not found' },
        { status: 404 }
      )
    }

    // Only owner or requester can view
    if (viewing.ownerId !== userId && viewing.requesterId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json(viewing)
  } catch (error) {
    console.error('Error fetching viewing:', error)
    return NextResponse.json(
      { error: 'Failed to fetch viewing' },
      { status: 500 }
    )
  }
}

// PATCH /api/viewings/[id] - Update viewing status
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const viewing = await getViewingById(id)

    if (!viewing) {
      return NextResponse.json(
        { error: 'Viewing not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { status, notes } = body

    // Only owner can confirm/complete, requester can cancel
    if (status === 'CONFIRMED' || status === 'COMPLETED') {
      if (viewing.ownerId !== userId) {
        return NextResponse.json(
          { error: 'Only property owner can confirm or complete viewings' },
          { status: 403 }
        )
      }
    }

    if (status === 'CANCELLED') {
      if (viewing.ownerId !== userId && viewing.requesterId !== userId) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updatedViewing = await updateViewingStatus(id, status, notes)

    return NextResponse.json(updatedViewing)
  } catch (error) {
    console.error('Error updating viewing:', error)
    return NextResponse.json(
      { error: 'Failed to update viewing' },
      { status: 500 }
    )
  }
}
