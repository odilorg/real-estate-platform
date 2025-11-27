import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createViewing, getViewingsByUserId, getPropertyById } from '@/lib/db'

// GET /api/viewings - Get user's viewings
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const viewings = await getViewingsByUserId(userId)

    return NextResponse.json(viewings)
  } catch (error) {
    console.error('Error fetching viewings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch viewings' },
      { status: 500 }
    )
  }
}

// POST /api/viewings - Create a new viewing request
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId, date, time, message } = body

    if (!propertyId || !date || !time) {
      return NextResponse.json(
        { error: 'Property ID, date, and time are required' },
        { status: 400 }
      )
    }

    // Get property to find owner
    const property = await getPropertyById(propertyId)

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Cannot schedule viewing for own property
    if (property.userId === userId) {
      return NextResponse.json(
        { error: 'Cannot schedule a viewing for your own property' },
        { status: 400 }
      )
    }

    const viewing = await createViewing({
      propertyId,
      requesterId: userId,
      ownerId: property.userId,
      date: new Date(date),
      time,
      message,
    })

    return NextResponse.json(viewing, { status: 201 })
  } catch (error) {
    console.error('Error creating viewing:', error)
    return NextResponse.json(
      { error: 'Failed to create viewing' },
      { status: 500 }
    )
  }
}
