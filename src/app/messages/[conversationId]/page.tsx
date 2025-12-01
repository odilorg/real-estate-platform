import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ChatView } from '@/components/messages/ChatView'
import { getConversationById, getPropertyById } from '@/lib/db'

interface PageProps {
  params: Promise<{
    conversationId: string
  }>
}

export default async function ConversationPage({ params }: PageProps) {
  const session = await getSession()
  const userId = session?.user?.id
  if (!userId) {
    redirect('/sign-in')
  }

  const { conversationId } = await params

  // Verify conversation exists and user is a participant
  const conversation = await getConversationById(conversationId)
  if (!conversation) {
    redirect('/messages')
  }

  const participants = [conversation.participant1, conversation.participant2]
  if (!participants.includes(userId)) {
    redirect('/messages')
  }

  // Get property info
  const property = await getPropertyById(conversation.propertyId)

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
