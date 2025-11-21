import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getDataStore } from '@/lib/dataStore'

// GET messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = params
    const dataStore = getDataStore()

    // Verify user is part of the conversation
    const conversation = dataStore.getConversationById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (!conversation.participants.includes(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const messages = dataStore.getMessagesByConversationId(conversationId)

    // Enrich messages with sender info
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        try {
          const client = await clerkClient()
          const user = await client.users.getUser(msg.senderId)
          return {
            ...msg,
            sender: {
              id: user.id,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
              imageUrl: user.imageUrl,
            },
          }
        } catch (error) {
          console.error('Error fetching sender:', error)
          return {
            ...msg,
            sender: {
              id: msg.senderId,
              name: 'Unknown User',
              imageUrl: '',
            },
          }
        }
      })
    )

    // Mark messages as read
    dataStore.markMessagesAsRead(conversationId, userId)

    return NextResponse.json({ messages: enrichedMessages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = params
    const { content } = await request.json()

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    const dataStore = getDataStore()

    // Verify user is part of the conversation
    const conversation = dataStore.getConversationById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (!conversation.participants.includes(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const message = dataStore.sendMessage(conversationId, userId, content.trim())

    if (!message) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
