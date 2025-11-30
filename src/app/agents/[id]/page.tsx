"use client"

import { useState, useEffect, use } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { MainLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Phone,
  Mail,
  MessageCircle,
  Star,
  MapPin,
  Building2,
  Calendar,
  Award,
  Shield,
  Clock,
  Home,
  User,
  Loader2,
  ChevronRight,
  Bed,
  Bath,
  Maximize,
} from 'lucide-react'

interface Agent {
  id: string
  firstName: string
  lastName: string
  photo: string | null
  bio: string | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  telegram: string | null
  licenseNumber: string | null
  specializations: string[]
  languages: string[]
  areasServed: string[]
  yearsExperience: number
  totalDeals: number
  verified: boolean
  superAgent: boolean
  responseTime: string | null
  rating: number
  reviewCount: number
  showPhone: boolean
  showEmail: boolean
  avgRating: number
  agency: {
    id: string
    name: string
    logo: string | null
  } | null
  reviews: {
    id: string
    rating: number
    comment: string | null
    dealType: string | null
    createdAt: string
  }[]
}

interface Listing {
  id: string
  title: string
  price: number
  listingType: string
  propertyType: string
  city: string
  state: string | null
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  images: string[]
}

interface Stats {
  totalListings: number
  activeListings: number
  soldListings: number
  reviewCount: number
  avgRating: number
}

export default function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslations('agent')
  const [agent, setAgent] = useState<Agent | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPhone, setShowPhone] = useState(false)

  useEffect(() => {
    loadAgent()
  }, [id])

  const loadAgent = async () => {
    try {
      const res = await fetch(`/api/agents/${id}`)
      if (res.ok) {
        const data = await res.json()
        setAgent(data.agent)
        setListings(data.listings)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading agent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
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

  if (!agent) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Agent Not Found</h1>
          <p className="text-gray-500 mb-6">The agent you're looking for doesn't exist.</p>
          <Link href="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Agent Photo */}
              <div className="relative">
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden bg-gray-200">
                  {agent.photo ? (
                    <Image
                      src={agent.photo}
                      alt={`${agent.firstName} ${agent.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {agent.verified && (
                  <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full">
                    <Shield className="h-5 w-5" />
                  </div>
                )}
              </div>

              {/* Agent Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {agent.firstName} {agent.lastName}
                    </h1>
                    <p className="text-gray-600">
                      {agent.agency ? agent.agency.name : t('privateOwner')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {agent.superAgent && (
                      <Badge className="bg-yellow-500 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        {t('superAgent')}
                      </Badge>
                    )}
                    {agent.verified && (
                      <Badge className="bg-blue-600 text-white">
                        <Shield className="h-3 w-3 mr-1" />
                        {t('verified')}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rating & Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(stats?.avgRating || 0))}
                    <span className="ml-1 font-semibold">{stats?.avgRating || 0}</span>
                    <span className="text-gray-500">({stats?.reviewCount} {t('reviews')})</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {agent.yearsExperience} {t('profile.yearsExperience')}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Home className="h-4 w-4" />
                    {stats?.totalListings} {t('profile.listings')}
                  </span>
                  {agent.responseTime && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1 text-green-600">
                        <Clock className="h-4 w-4" />
                        {t(`responseTime.${agent.responseTime}`)}
                      </span>
                    </>
                  )}
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {agent.showPhone && agent.phone && (
                    <Button
                      variant={showPhone ? 'default' : 'outline'}
                      onClick={() => setShowPhone(!showPhone)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {showPhone ? agent.phone : t('showPhone')}
                    </Button>
                  )}
                  {agent.whatsapp && (
                    <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank">
                      <Button variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </a>
                  )}
                  {agent.telegram && (
                    <a href={`https://t.me/${agent.telegram}`} target="_blank">
                      <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Telegram
                      </Button>
                    </a>
                  )}
                  {agent.showEmail && agent.email && (
                    <a href={`mailto:${agent.email}`}>
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        {t('writeMessage')}
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="listings" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="listings">{t('profile.listings')} ({stats?.activeListings})</TabsTrigger>
                  <TabsTrigger value="reviews">{t('reviews')} ({stats?.reviewCount})</TabsTrigger>
                  <TabsTrigger value="about">{t('profile.about')}</TabsTrigger>
                </TabsList>

                {/* Listings Tab */}
                <TabsContent value="listings">
                  {listings.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Home className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No active listings</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {listings.map((listing) => (
                        <Link key={listing.id} href={`/properties/${listing.id}`}>
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="relative h-24 w-32 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                  {listing.images[0] ? (
                                    <Image
                                      src={listing.images[0]}
                                      alt={listing.title}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <Home className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
                                      <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {listing.city}{listing.state && `, ${listing.state}`}
                                      </p>
                                    </div>
                                    <Badge variant={listing.listingType === 'SALE' ? 'default' : 'secondary'}>
                                      {listing.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                                    </Badge>
                                  </div>
                                  <p className="text-lg font-bold text-blue-600 mt-2">
                                    {formatPrice(listing.price)}
                                    {listing.listingType === 'RENT' && <span className="text-sm font-normal">/mo</span>}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                    {listing.bedrooms && (
                                      <span className="flex items-center gap-1">
                                        <Bed className="h-3 w-3" /> {listing.bedrooms}
                                      </span>
                                    )}
                                    {listing.bathrooms && (
                                      <span className="flex items-center gap-1">
                                        <Bath className="h-3 w-3" /> {listing.bathrooms}
                                      </span>
                                    )}
                                    {listing.area && (
                                      <span className="flex items-center gap-1">
                                        <Maximize className="h-3 w-3" /> {listing.area} m²
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 self-center" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews">
                  {agent.reviews.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No reviews yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {agent.reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                {review.dealType && (
                                  <Badge variant="outline" className="text-xs">
                                    {review.dealType}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="mt-3 text-gray-700">{review.comment}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* About Tab */}
                <TabsContent value="about">
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      {agent.bio && (
                        <div>
                          <h3 className="font-semibold mb-2">{t('profile.about')}</h3>
                          <p className="text-gray-600 whitespace-pre-line">{agent.bio}</p>
                        </div>
                      )}

                      {agent.specializations.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">{t('profile.specializations')}</h3>
                          <div className="flex flex-wrap gap-2">
                            {agent.specializations.map((spec) => (
                              <Badge key={spec} variant="outline">{spec}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {agent.languages.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">{t('profile.languages')}</h3>
                          <div className="flex flex-wrap gap-2">
                            {agent.languages.map((lang) => (
                              <Badge key={lang} variant="secondary">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {agent.areasServed.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">{t('profile.areasServed')}</h3>
                          <div className="flex flex-wrap gap-2">
                            {agent.areasServed.map((area) => (
                              <Badge key={area} variant="outline">
                                <MapPin className="h-3 w-3 mr-1" />
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {agent.licenseNumber && (
                        <div>
                          <h3 className="font-semibold mb-1">{t('profile.license')}</h3>
                          <p className="text-gray-600">{agent.licenseNumber}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('profile.experience')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('profile.listings')}</span>
                    <span className="font-semibold">{stats?.totalListings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('activeListings')}</span>
                    <span className="font-semibold">{stats?.activeListings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Deals Closed</span>
                    <span className="font-semibold">{agent.totalDeals}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('profile.yearsExperience')}</span>
                    <span className="font-semibold">{agent.yearsExperience}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Agency Card */}
              {agent.agency && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('realEstateAgency')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      {agent.agency.logo ? (
                        <div className="relative h-12 w-12 rounded overflow-hidden">
                          <Image
                            src={agent.agency.logo}
                            alt={agent.agency.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{agent.agency.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('profile.contactInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {agent.showPhone && agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                    >
                      <Phone className="h-5 w-5" />
                      {agent.phone}
                    </a>
                  )}
                  {agent.showEmail && agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                    >
                      <Mail className="h-5 w-5" />
                      {agent.email}
                    </a>
                  )}
                  {agent.whatsapp && (
                    <a
                      href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      className="flex items-center gap-3 text-gray-600 hover:text-green-600"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </a>
                  )}
                  {agent.telegram && (
                    <a
                      href={`https://t.me/${agent.telegram}`}
                      target="_blank"
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                    >
                      <MessageCircle className="h-5 w-5" />
                      @{agent.telegram}
                    </a>
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
