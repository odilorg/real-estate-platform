import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ChatView } from '@/components/messages/ChatView'
import { getDataStore } from '@/lib/dataStore'

interface PageProps {
  params: {
    conversationId: string
  }
}

export default async function ConversationPage({ params }: PageProps) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const { conversationId } = params
  const dataStore = getDataStore()

  // Verify conversation exists and user is a participant
  const conversation = dataStore.getConversationById(conversationId)
  if (!conversation) {
    redirect('/messages')
  }

  if (!conversation.participants.includes(userId)) {
    redirect('/messages')
  }

  // Get property info
  const property = dataStore.getPropertyById(conversation.propertyId)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ChatView
        conversationId={conversationId}
        propertyId={conversation.propertyId}
        propertyTitle={property?.title || 'Unknown Property'}
        propertyImage={property?.images[0] || ''}
        currentUserId={userId}
      />
    </div>
  )
}
