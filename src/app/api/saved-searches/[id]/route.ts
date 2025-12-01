import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { getSavedSearchById, updateSavedSearch, deleteSavedSearch } from '@/lib/db'

// GET single saved search
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const savedSearch = await getSavedSearchById(id)

    if (!savedSearch) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 })
    }

    // Check ownership
    if (savedSearch.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ savedSearch })
  } catch (error) {
    console.error('Error fetching saved search:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved search' },
      { status: 500 }
    )
  }
}

// PUT update saved search
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, filters, notificationsEnabled } = body

    const savedSearch = await getSavedSearchById(id)

    if (!savedSearch) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 })
    }

    // Check ownership
    if (savedSearch.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updates: { name?: string; filters?: any; notificationsEnabled?: boolean } = {}
    if (name !== undefined) updates.name = name.trim()
    if (filters !== undefined) updates.filters = filters
    if (notificationsEnabled !== undefined) updates.notificationsEnabled = notificationsEnabled

    const updatedSearch = await updateSavedSearch(id, updates)

    if (!updatedSearch) {
      return NextResponse.json(
        { error: 'Failed to update saved search' },
        { status: 500 }
      )
    }

    return NextResponse.json({ savedSearch: updatedSearch })
  } catch (error) {
    console.error('Error updating saved search:', error)
    return NextResponse.json(
      { error: 'Failed to update saved search' },
      { status: 500 }
    )
  }
}

// DELETE saved search
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const savedSearch = await getSavedSearchById(id)

    if (!savedSearch) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 })
    }

    // Check ownership
    if (savedSearch.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const deleted = await deleteSavedSearch(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete saved search' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting saved search:', error)
    return NextResponse.json(
      { error: 'Failed to delete saved search' },
      { status: 500 }
    )
  }
}
