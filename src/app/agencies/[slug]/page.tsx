"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MainLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Phone,
  Mail,
  MessageCircle,
  Star,
  MapPin,
  Award,
  Shield,
  Clock,
  Home,
  User,
  Loader2,
  Building2,
  Globe,
  CheckCircle,
  Users,
  ArrowLeft,
} from 'lucide-react'

interface Agent {
  id: string
  firstName: string
  lastName: string
  photo: string | null
  phone: string | null
  whatsapp: string | null
  yearsExperience: number
  verified: boolean
  superAgent: boolean
  specializations: string[]
  areasServed: string[]
  listingsCount: number
  reviewCount: number
  avgRating: number
}

interface Agency {
  id: string
  name: string
  slug: string
  logo: string | null
  description: string | null
  website: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  yearsOnPlatform: number
  verified: boolean
  agentsCount: number
  totalListings: number
  totalReviews: number
  avgRating: number
  agents: Agent[]
}

export default function AgencyProfilePage() {
  const t = useTranslations('agencyProfile')
  const tAgent = useTranslations('agent')
  const tCatalog = useTranslations('agentsCatalog')
  const params = useParams()
  const slug = params.slug as string

  const [agency, setAgency] = useState<Agency | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAgency()
  }, [slug])

  const loadAgency = async () => {
    try {
      const res = await fetch(`/api/agencies/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setAgency(data.agency)
      } else if (res.status === 404) {
        setError('Agency not found')
      } else {
        setError('Failed to load agency')
      }
    } catch (error) {
      console.error('Error loading agency:', error)
      setError('Failed to load agency')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    )
  }

  if (error || !agency) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Building2 className="h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t('notFound')}</h1>
          <p className="text-gray-500 mb-4">{t('notFoundDesc')}</p>
          <Link href="/agents?tab=agencies">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToCatalog')}
            </Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            {/* Back Link */}
            <Link href="/agents?tab=agencies" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('backToCatalog')}
            </Link>

            <div className="flex items-start gap-6">
              {/* Logo */}
              <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border">
                {agency.logo ? (
                  <Image
                    src={agency.logo}
                    alt={agency.name}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                      {agency.name}
                      {agency.verified && (
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      )}
                    </h1>

                    {agency.city && (
                      <p className="text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {agency.address ? `${agency.address}, ${agency.city}` : agency.city}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-3">
                      {agency.avgRating > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">{agency.avgRating}</span>
                          {renderStars(Math.round(agency.avgRating))}
                          <span className="text-gray-500">
                            ({agency.totalReviews} {tAgent('reviews')})
                          </span>
                        </div>
                      )}
                      <span className="text-gray-500">
                        {agency.yearsOnPlatform} {tAgent('years')} {tAgent('onPlatform')}
                      </span>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex gap-2">
                    {agency.phone && (
                      <Button onClick={() => window.location.href = `tel:${agency.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        {tCatalog('call')}
                      </Button>
                    )}
                    {agency.website && (
                      <Button variant="outline" onClick={() => window.open(agency.website!, '_blank')}>
                        <Globe className="h-4 w-4 mr-2" />
                        {t('website')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {agency.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('about')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 whitespace-pre-line">{agency.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Agents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('ourAgents')} ({agency.agentsCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {agency.agents.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">{t('noAgents')}</p>
                  ) : (
                    <div className="space-y-4">
                      {agency.agents.map((agent) => (
                        <Link key={agent.id} href={`/agents/${agent.id}`}>
                          <div className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            {/* Photo */}
                            <div className="relative h-16 w-16 flex-shrink-0 rounded-full overflow-hidden bg-blue-500">
                              {agent.photo ? (
                                <Image
                                  src={agent.photo}
                                  alt={`${agent.firstName} ${agent.lastName}`}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-white text-lg font-semibold">
                                  {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold flex items-center gap-2">
                                    {agent.firstName} {agent.lastName}
                                    {agent.superAgent && (
                                      <Badge className="bg-blue-600 text-white text-xs">
                                        <Award className="h-3 w-3 mr-1" />
                                        {tAgent('superAgent')}
                                      </Badge>
                                    )}
                                    {agent.verified && !agent.superAgent && (
                                      <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                                        <Shield className="h-3 w-3 mr-1" />
                                        {tAgent('verified')}
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {agent.yearsExperience} {tAgent('years')} {tAgent('onPlatform')}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{agent.listingsCount} {tCatalog('properties')}</p>
                                  <p className="text-xs text-gray-500">{tCatalog('inWork')}</p>
                                </div>
                              </div>

                              {/* Rating */}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="font-semibold">{agent.avgRating || '0.0'}</span>
                                {renderStars(Math.round(agent.avgRating))}
                                <span className="text-sm text-gray-500">
                                  ({agent.reviewCount})
                                </span>
                              </div>

                              {/* Areas */}
                              {agent.areasServed.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {agent.areasServed.slice(0, 3).map((area) => (
                                    <Badge key={area} variant="secondary" className="text-xs font-normal">
                                      <MapPin className="h-2.5 w-2.5 mr-1" />
                                      {area}
                                    </Badge>
                                  ))}
                                  {agent.areasServed.length > 3 && (
                                    <Badge variant="secondary" className="text-xs font-normal">
                                      +{agent.areasServed.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('stats')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{t('totalAgents')}</span>
                    <span className="font-semibold">{agency.agentsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{t('totalListings')}</span>
                    <span className="font-semibold">{agency.totalListings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{t('totalReviews')}</span>
                    <span className="font-semibold">{agency.totalReviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{t('avgRating')}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{agency.avgRating || '-'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('contact')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {agency.phone && (
                    <a href={`tel:${agency.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                      <Phone className="h-4 w-4" />
                      {agency.phone}
                    </a>
                  )}
                  {agency.email && (
                    <a href={`mailto:${agency.email}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                      <Mail className="h-4 w-4" />
                      {agency.email}
                    </a>
                  )}
                  {agency.website && (
                    <a href={agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                      <Globe className="h-4 w-4" />
                      {agency.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  {agency.address && (
                    <p className="flex items-start gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      {agency.address}{agency.city && `, ${agency.city}`}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
