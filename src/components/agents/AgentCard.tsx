"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ContactModal } from './ContactModal'
import {
  Phone,
  MessageCircle,
  Shield,
  Star,
  Clock,
  Building2,
  ChevronRight,
  Award,
  Eye,
  EyeOff,
} from 'lucide-react'

interface AgentCardProps {
  agent: {
    id: string
    firstName: string
    lastName: string
    photo?: string | null
    phone?: string | null
    email?: string | null
    whatsapp?: string | null
    telegram?: string | null
    verified: boolean
    superAgent: boolean
    responseTime?: string | null
    rating: number
    reviewCount: number
    yearsExperience: number
    showPhone: boolean
    agency?: {
      id: string
      name: string
      logo?: string | null
      yearsOnPlatform: number
      verified: boolean
    } | null
  }
  listingsCount: number
  onContact?: () => void
  propertyId?: string
  property?: {
    title: string
    price: number
    currency: string
    image?: string | null
  }
}

export function AgentCard({ agent, listingsCount, onContact, propertyId, property }: AgentCardProps) {
  const t = useTranslations('agent')
  const [showPhone, setShowPhone] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleContact = () => {
    if (onContact) {
      onContact()
      return
    }

    // Check if user is authenticated
    if (!session?.user?.id) {
      router.push('/sign-in')
      return
    }

    if (!propertyId) {
      return
    }

    // Open contact modal
    setShowContactModal(true)
  }

  const fullName = `${agent.firstName} ${agent.lastName}`

  const getResponseTimeLabel = (time: string | null | undefined) => {
    switch (time) {
      case 'fast':
        return t('responseTime.fast')
      case 'medium':
        return t('responseTime.medium')
      case 'slow':
        return t('responseTime.slow')
      default:
        return null
    }
  }

  const responseTimeLabel = getResponseTimeLabel(agent.responseTime)

  return (
    <div className="space-y-4">
      {/* Agency Card (if agent belongs to an agency) */}
      {agent.agency && (
        <Card>
          <CardContent className="p-4">
            <Link href={`/agencies/${agent.agency.id}`} className="block hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-3">
                {agent.agency.logo ? (
                  <div className="w-12 h-12 relative rounded overflow-hidden bg-gray-100">
                    <Image
                      src={agent.agency.logo}
                      alt={agent.agency.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    {t('realEstateAgency')}
                  </p>
                  <p className="font-semibold text-gray-900">{agent.agency.name}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
            <div className="flex items-center gap-6 mt-3 pt-3 border-t text-sm">
              <div>
                <span className="text-gray-500">{t('onPlatform')}</span>
                <p className="font-semibold">
                  {agent.agency.yearsOnPlatform} {t('years')}
                </p>
              </div>
              <div>
                <span className="text-gray-500">{t('activeListings')}</span>
                <p className="font-semibold">{listingsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Card */}
      <Card>
        <CardContent className="p-4">
          <Link href={`/agents/${agent.id}`} className="block">
            <div className="flex items-start gap-3">
              {/* Agent Photo */}
              <div className="relative">
                {agent.photo ? (
                  <div className="w-14 h-14 relative rounded-full overflow-hidden">
                    <Image
                      src={agent.photo}
                      alt={fullName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {agent.firstName[0]}{agent.lastName[0]}
                    </span>
                  </div>
                )}
                {agent.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Agent Info */}
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  {t('realtor')}
                </p>
                <p className="font-semibold text-gray-900">{fullName}</p>
                {agent.superAgent && (
                  <Badge className="bg-green-100 text-green-800 mt-1">
                    <Award className="h-3 w-3 mr-1" />
                    {t('superAgent')}
                  </Badge>
                )}
              </div>
            </div>
          </Link>

          {/* Rating & Stats */}
          {agent.reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-3 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 font-semibold">{agent.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {agent.reviewCount} {t('reviews')}
              </span>
            </div>
          )}

          {/* Response Time */}
          {responseTimeLabel && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-green-600" />
              <span>{responseTimeLabel}</span>
            </div>
          )}

          {/* Contact Buttons */}
          <div className="space-y-2 mt-4">
            {/* Show Phone Button */}
            {agent.phone && agent.showPhone && (
              <Button
                className="w-full"
                onClick={() => setShowPhone(!showPhone)}
              >
                {showPhone ? (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    {agent.phone}
                  </>
                ) : (
                  <>
                    {showPhone ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {t('showPhone')}
                  </>
                )}
              </Button>
            )}

            {/* Message Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleContact}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('writeMessage')}
            </Button>
          </div>

          {/* Messenger Links */}
          {(agent.whatsapp || agent.telegram) && (
            <div className="flex gap-2 mt-3">
              {agent.whatsapp && (
                <a
                  href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 border rounded-lg text-center text-sm hover:bg-gray-50 transition-colors"
                >
                  WhatsApp
                </a>
              )}
              {agent.telegram && (
                <a
                  href={`https://t.me/${agent.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 border rounded-lg text-center text-sm hover:bg-gray-50 transition-colors"
                >
                  Telegram
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Modal */}
      {propertyId && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          propertyId={propertyId}
          property={property}
          recipient={{
            name: fullName,
            photo: agent.photo,
            isAgent: true,
          }}
        />
      )}
    </div>
  )
}

// Simple version for when there's no agent (just show owner contact)
export function OwnerContactCard({
  ownerId,
  propertyId,
  property,
}: {
  ownerId: string
  propertyId?: string
  property?: {
    title: string
    price: number
    currency: string
    image?: string | null
  }
}) {
  const t = useTranslations('agent')
  const [showContactModal, setShowContactModal] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleContact = () => {
    // Check if user is authenticated
    if (!session?.user?.id) {
      router.push('/sign-in')
      return
    }

    // Check if trying to message own property
    if (ownerId === session.user.id) {
      console.log('Cannot message own property')
      return
    }

    if (!propertyId) {
      return
    }

    // Open contact modal
    setShowContactModal(true)
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                {t('propertyOwner')}
              </p>
              <p className="font-semibold text-gray-900">{t('privateOwner')}</p>
            </div>
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={handleContact}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {t('contactOwner')}
          </Button>
        </CardContent>
      </Card>

      {/* Contact Modal */}
      {propertyId && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          propertyId={propertyId}
          property={property}
          recipient={{
            name: t('privateOwner') || 'Private Owner',
            isAgent: false,
          }}
        />
      )}
    </>
  )
}
