import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getDataStore } from '@/lib/dataStore'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { propertyId, message } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }

    const dataStore = getDataStore()
    const property = dataStore.getPropertyById(propertyId)

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (!property.userId) {
      return NextResponse.json({ error: 'Property has no owner' }, { status: 400 })
    }

    if (property.userId === userId) {
      return NextResponse.json(
        { error: 'Cannot message your own property' },
        { status: 400 }
      )
    }

    // Get or create conversation
    const conversation = dataStore.getOrCreateConversation(
      propertyId,
      userId,
      property.userId
    )

    // Send initial message if provided
    if (message && typeof message === 'string' && message.trim().length > 0) {
      dataStore.sendMessage(conversation.id, userId, message.trim())
    }

    return NextResponse.json({ conversationId: conversation.id }, { status: 201 })
  } catch (error) {
    console.error('Error starting conversation:', error)
    return NextResponse.json(
      { error: 'Failed to start conversation' },
      { status: 500 }
    )
  }
}
