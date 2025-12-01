import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { addRecentlyViewed, getRecentlyViewed } from '@/lib/db'

// GET /api/recently-viewed - Get user's recently viewed properties
export async function GET() {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const properties = await getRecentlyViewed(userId, 10)

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching recently viewed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recently viewed' },
      { status: 500 }
    )
  }
}

// POST /api/recently-viewed - Add a property to recently viewed
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId } = body

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    await addRecentlyViewed(userId, propertyId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding recently viewed:', error)
    return NextResponse.json(
      { error: 'Failed to add recently viewed' },
      { status: 500 }
    )
  }
}
