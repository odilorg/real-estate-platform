"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

interface ContactOwnerButtonProps {
  propertyId: string
  ownerId?: string
  currentUserId?: string
}

export function ContactOwnerButton({ propertyId, ownerId, currentUserId }: ContactOwnerButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { userId } = useAuth()

  const handleContact = async () => {
    // Check if user is authenticated
    if (!userId) {
      router.push('/sign-in')
      return
    }

    // Check if property has an owner
    if (!ownerId) {
      toast.error("This property doesn't have an owner assigned yet")
      return
    }

    // Check if trying to message own property
    if (ownerId === currentUserId) {
      toast.error("You can't message your own property")
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/messages/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          message: "Hi, I'm interested in this property. Can you provide more details?",
        }),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/messages/${data.conversationId}`)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to start conversation')
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
      toast.error('Failed to start conversation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleContact} disabled={loading} className="w-full">
      <MessageSquare className="h-4 w-4 mr-2" />
      {loading ? 'Starting...' : 'Contact Owner'}
    </Button>
  )
}
