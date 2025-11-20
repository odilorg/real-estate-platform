import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDataStore } from '@/lib/dataStore'

// GET /api/users/me/properties - Get all properties for current user
export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const dataStore = getDataStore()
    const userProperties = dataStore.getPropertiesByUserId(userId)

    return NextResponse.json(userProperties)
  } catch (error) {
    console.error('Error fetching user properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user properties' },
      { status: 500 }
    )
  }
}
