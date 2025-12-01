"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  MessageCircle,
  Send,
  CheckCircle,
  User,
  Building2,
  ExternalLink,
} from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId: string
  property?: {
    title: string
    price: number
    currency: string
    image?: string | null
  }
  recipient?: {
    name: string
    photo?: string | null
    isAgent: boolean
  }
}

export function ContactModal({
  isOpen,
  onClose,
  propertyId,
  property,
  recipient,
}: ContactModalProps) {
  const t = useTranslations('agent')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [message, setMessage] = useState(
    "Здравствуйте! Интересует ваш объект. Можете предоставить больше информации?"
  )
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    if (!message.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/messages/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          message: message.trim(),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setConversationId(data.conversationId)
        setSuccess(true)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setError(errorData.error || 'Failed to send message')
      }
    } catch (err) {
      console.error('Error starting conversation:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Reset state when closing
    if (!loading) {
      setSuccess(false)
      setConversationId(null)
      setError(null)
      setMessage("Здравствуйте! Интересует ваш объект. Можете предоставить больше информации?")
      onClose()
    }
  }

  const handleViewConversation = () => {
    if (conversationId) {
      router.push(`/messages/${conversationId}`)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            {success ? (tCommon('messageSent') || 'Message Sent') : (t('writeMessage') || 'Send Message')}
          </DialogTitle>
          <DialogDescription>
            {success
              ? (tCommon('messageSentDescription') || 'Your message has been sent successfully')
              : (tCommon('contactDescription') || 'Send a message about this property')}
          </DialogDescription>
        </DialogHeader>

        {/* Property Preview */}
        {property && (
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            {property.image ? (
              <div className="w-14 h-14 relative rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                {property.title}
              </p>
              <p className="text-sm text-blue-600 font-semibold mt-1">
                {formatPrice(property.price, property.currency)}
              </p>
            </div>
          </div>
        )}

        {/* Recipient Info */}
        {recipient && (
          <div className="flex items-center gap-3 py-1">
            {recipient.photo ? (
              <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
                <Image
                  src={recipient.photo}
                  alt={recipient.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {recipient.isAgent ? t('realtor') : t('propertyOwner')}
              </p>
              <p className="font-medium text-gray-900 truncate">{recipient.name}</p>
            </div>
          </div>
        )}

        {success ? (
          /* Success State */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 mb-4">
                {tCommon('messageDelivered') || 'Your message has been delivered. The recipient will respond soon.'}
              </p>
              <div className="flex flex-col gap-2">
                <Button onClick={handleViewConversation} className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {tCommon('viewConversation') || 'View Conversation'}
                </Button>
                <Button variant="outline" onClick={handleClose} className="w-full">
                  {tCommon('close') || 'Close'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Message Form */
          <div className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('messagePlaceholder') || 'Write your message...'}
              rows={3}
              className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 h-11"
              >
                {tCommon('cancel') || 'Cancel'}
              </Button>
              <Button
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className="flex-1 h-11 bg-gray-900 hover:bg-gray-800"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('sending') || 'Sending...'}
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {t('send') || 'Send'}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
