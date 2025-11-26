import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getConversationsByUserId, getMessagesByConversationId, getPropertyById } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversations = await getConversationsByUserId(userId)

    // Enrich conversations with property and participant info
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const property = await getPropertyById(conv.propertyId)
        const messages = await getMessagesByConversationId(conv.id)
        const lastMessage = messages[messages.length - 1]

        // Get other participant info
        const otherParticipantId = conv.participant1 === userId ? conv.participant2 : conv.participant1
        let otherParticipant = null

        if (otherParticipantId) {
          try {
            const client = await clerkClient()
            const user = await client.users.getUser(otherParticipantId)
            otherParticipant = {
              id: user.id,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
              email: user.emailAddresses[0]?.emailAddress || '',
              imageUrl: user.imageUrl,
            }
          } catch (error) {
            // User might not exist
          }
        }

        // Count unread messages
        const unreadCount = messages.filter(
          m => m.senderId !== userId && !m.read
        ).length

        return {
          ...conv,
          participants: [conv.participant1, conv.participant2],
          property: property ? {
            id: property.id,
            title: property.title,
            images: property.images,
            price: property.price,
          } : null,
          otherParticipant,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            senderId: lastMessage.senderId,
          } : null,
          unreadCount,
        }
      })
    )

    return NextResponse.json({ conversations: enrichedConversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
