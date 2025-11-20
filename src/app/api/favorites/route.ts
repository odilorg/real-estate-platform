import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDataStore } from '@/lib/dataStore'

// GET /api/favorites - Get all favorites for current user
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
    const favoriteProperties = dataStore.getFavoritePropertiesByUserId(userId)

    return NextResponse.json(favoriteProperties)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add property to favorites
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { propertyId } = body

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    const dataStore = getDataStore()

    // Check if property exists
    const property = dataStore.getPropertyById(propertyId)
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Add to favorites
    const favorite = dataStore.addFavorite(userId, propertyId)

    if (!favorite) {
      return NextResponse.json(
        { error: 'Property already in favorites or failed to add' },
        { status: 400 }
      )
    }

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Remove property from favorites
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { propertyId } = body

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    const dataStore = getDataStore()
    const removed = dataStore.removeFavorite(userId, propertyId)

    if (!removed) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Favorite removed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
