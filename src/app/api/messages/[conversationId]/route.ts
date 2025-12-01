import { getSession, getUserById } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { getConversationById, getMessagesByConversationId, markMessagesAsRead, sendMessage } from '@/lib/db'

// GET messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getSession()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await params

    // Verify user is part of the conversation
    const conversation = await getConversationById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (conversation.participant1 !== userId && conversation.participant2 !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const messages = await getMessagesByConversationId(conversationId)

    // Enrich messages with sender info
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        try {
          const user = await getUserById(msg.senderId)
          if (user) {
            return {
              ...msg,
              sender: {
                id: user.id,
                name: user.name || 'Anonymous',
                imageUrl: user.image,
              },
            }
          }
          return {
            ...msg,
            sender: {
              id: msg.senderId,
              name: 'Unknown User',
              imageUrl: '',
            },
          }
        } catch (error) {
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
    await markMessagesAsRead(conversationId, userId)

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
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getSession()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await params
    const { content } = await request.json()

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    // Verify user is part of the conversation
    const conversation = await getConversationById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (conversation.participant1 !== userId && conversation.participant2 !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const message = await sendMessage(conversationId, userId, content.trim())

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
