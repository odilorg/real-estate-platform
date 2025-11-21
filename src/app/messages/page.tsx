import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare } from 'lucide-react'

interface ConversationData {
  id: string
  propertyId: string
  participants: string[]
  lastMessageAt: Date
  createdAt: Date
  property: {
    id: string
    title: string
    images: string[]
    price: number
  } | null
  otherParticipant: {
    id: string
    name: string
    email: string
    imageUrl: string
  } | null
  lastMessage: {
    content: string
    createdAt: Date
    senderId: string
  } | null
  unreadCount: number
}

async function getConversations(): Promise<ConversationData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/messages/conversations`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return []
  }

  const data = await res.json()
  return data.conversations || []
}

export default async function MessagesPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const conversations = await getConversations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">
          View and manage your property inquiries
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No conversations yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start a conversation by inquiring about a property
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md divide-y">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="flex gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Property Image */}
              {conversation.property && conversation.property.images[0] && (
                <div className="flex-shrink-0 w-24 h-24 relative rounded-lg overflow-hidden">
                  <Image
                    src={conversation.property.images[0]}
                    alt={conversation.property.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                {/* Property Title */}
                {conversation.property && (
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {conversation.property.title}
                  </h3>
                )}

                {/* Other Participant */}
                {conversation.otherParticipant && (
                  <p className="text-sm text-gray-600 mb-2">
                    Chatting with: {conversation.otherParticipant.name}
                  </p>
                )}

                {/* Last Message */}
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage.senderId === userId ? 'You: ' : ''}
                    {conversation.lastMessage.content}
                  </p>
                )}

                {/* Timestamp */}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(conversation.lastMessageAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Unread Badge */}
              {conversation.unreadCount > 0 && (
                <div className="flex-shrink-0 flex items-center">
                  <span className="bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
