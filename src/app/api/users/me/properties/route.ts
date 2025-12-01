import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getPropertiesByUserId } from '@/lib/db'

// GET /api/users/me/properties - Get all properties for current user
export async function GET() {
  try {
    // Check authentication
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userProperties = await getPropertiesByUserId(userId)

    return NextResponse.json(userProperties)
  } catch (error) {
    console.error('Error fetching user properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user properties' },
      { status: 500 }
    )
  }
}
