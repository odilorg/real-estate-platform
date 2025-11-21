import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/dataStore'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dataStore = getDataStore()
    const conversations = dataStore.getConversationsByUserId(userId)

    // Enrich conversations with property and participant info
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const property = dataStore.getPropertyById(conv.propertyId)
        const messages = dataStore.getMessagesByConversationId(conv.id)
        const lastMessage = messages[messages.length - 1]

        // Get other participant info
        const otherParticipantId = conv.participants.find(id => id !== userId)
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
            console.error('Error fetching user:', error)
          }
        }

        // Count unread messages
        const unreadCount = messages.filter(
          m => m.senderId !== userId && !m.read
        ).length

        return {
          ...conv,
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
