import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getSavedSearchesByUserId, createSavedSearch } from '@/lib/db'

// GET all saved searches for current user
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const savedSearches = await getSavedSearchesByUserId(userId)

    return NextResponse.json({ savedSearches })
  } catch (error) {
    console.error('Error fetching saved searches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved searches' },
      { status: 500 }
    )
  }
}

// POST create a new saved search
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, filters, notificationsEnabled } = body

    // Validate input
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Search name is required' },
        { status: 400 }
      )
    }

    const savedSearch = await createSavedSearch({
      userId,
      name: name.trim(),
      filters: filters || {},
      notificationsEnabled: notificationsEnabled ?? false,
    })

    return NextResponse.json({ savedSearch }, { status: 201 })
  } catch (error) {
    console.error('Error creating saved search:', error)
    return NextResponse.json(
      { error: 'Failed to create saved search' },
      { status: 500 }
    )
  }
}
