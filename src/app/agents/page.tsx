"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Phone,
  MessageCircle,
  Star,
  MapPin,
  Award,
  Shield,
  Clock,
  Home,
  User,
  Loader2,
  Search,
  Building2,
  Users,
  ArrowUpDown,
  CheckCircle,
} from 'lucide-react'

interface Agent {
  id: string
  firstName: string
  lastName: string
  photo: string | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  telegram: string | null
  yearsExperience: number
  verified: boolean
  superAgent: boolean
  responseTime: string | null
  specializations: string[]
  languages: string[]
  areasServed: string[]
  agency: {
    id: string
    name: string
    logo: string | null
  } | null
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
  phone: string | null
  city: string | null
  yearsOnPlatform: number
  verified: boolean
  agentsCount: number
  totalListings: number
  avgRating: number
  totalReviews: number
  agents: {
    id: string
    firstName: string
    lastName: string
    photo: string | null
  }[]
}

export default function AgentsCatalogPage() {
  const t = useTranslations('agentsCatalog')
  const tAgent = useTranslations('agent')
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'agents')
  const [agents, setAgents] = useState<Agent[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  useEffect(() => {
    if (activeTab === 'agents') {
      loadAgents()
    } else {
      loadAgencies()
    }
  }, [activeTab, verifiedOnly])

  const loadAgents = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (verifiedOnly) params.set('verified', 'true')

      const res = await fetch(`/api/agents?${params}`)
      if (res.ok) {
        const data = await res.json()
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Error loading agents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAgencies = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (verifiedOnly) params.set('verified', 'true')
      if (sortBy !== 'default') params.set('sortBy', sortBy)

      const res = await fetch(`/api/agencies?${params}`)
      if (res.ok) {
        const data = await res.json()
        setAgencies(data.agencies)
      }
    } catch (error) {
      console.error('Error loading agencies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/agents?tab=${value}`, { scroll: false })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  // Filter agents
  const filteredAgents = agents.filter((agent) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      agent.firstName.toLowerCase().includes(query) ||
      agent.lastName.toLowerCase().includes(query) ||
      agent.agency?.name.toLowerCase().includes(query) ||
      agent.areasServed.some((area) => area.toLowerCase().includes(query)) ||
      agent.specializations.some((spec) => spec.toLowerCase().includes(query))
    )
  })

  // Sort agents
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === 'rating') return b.avgRating - a.avgRating
    if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience
    if (sortBy === 'listings') return b.listingsCount - a.listingsCount
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount
    // Default: super agents first, then verified, then by rating
    if (a.superAgent !== b.superAgent) return a.superAgent ? -1 : 1
    if (a.verified !== b.verified) return a.verified ? -1 : 1
    return b.avgRating - a.avgRating
  })

  // Filter agencies
  const filteredAgencies = agencies.filter((agency) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      agency.name.toLowerCase().includes(query) ||
      agency.description?.toLowerCase().includes(query) ||
      agency.city?.toLowerCase().includes(query)
    )
  })

  const totalCount = activeTab === 'agents' ? sortedAgents.length : filteredAgencies.length

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-4">
              <TabsList>
                <TabsTrigger value="agents" className="gap-2">
                  <User className="h-4 w-4" />
                  {t('agents')}
                </TabsTrigger>
                <TabsTrigger value="agencies" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  {t('agencies')}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* City Filter */}
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder={t('allCities')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allCities')}</SelectItem>
                  <SelectItem value="tashkent">Tashkent</SelectItem>
                  <SelectItem value="samarkand">Samarkand</SelectItem>
                  <SelectItem value="bukhara">Bukhara</SelectItem>
                </SelectContent>
              </Select>

              {/* Verified Filter */}
              <Button
                variant={verifiedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className="gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                {t('verifiedOnly')}
              </Button>

              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={activeTab === 'agents' ? t('searchAgents') : t('searchAgencies')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>
            </div>

            {/* Results count and sorting */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                {t('found')} <span className="font-semibold">{totalCount}</span> {activeTab === 'agents' ? t('agentsCount') : t('agenciesCount')}
              </p>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] bg-white">
                    <SelectValue placeholder={t('sortDefault')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t('sortDefault')}</SelectItem>
                    <SelectItem value="rating">{t('sortRating')}</SelectItem>
                    <SelectItem value="experience">{t('sortExperience')}</SelectItem>
                    <SelectItem value="reviews">{t('sortReviews')}</SelectItem>
                    {activeTab === 'agents' && (
                      <SelectItem value="listings">{t('sortListings')}</SelectItem>
                    )}
                    {activeTab === 'agencies' && (
                      <SelectItem value="agents">{t('sortAgentsCount')}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : activeTab === 'agents' ? (
            /* Agents List */
            sortedAgents.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t('noAgents')}</h2>
                <p className="text-gray-500">{t('noAgentsDesc')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedAgents.map((agent) => (
                  <Card key={agent.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Photo */}
                        <Link href={`/agents/${agent.id}`}>
                          <div className="relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden bg-blue-500">
                            {agent.photo ? (
                              <Image
                                src={agent.photo}
                                alt={`${agent.firstName} ${agent.lastName}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-white text-xl font-semibold">
                                {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Main Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link href={`/agents/${agent.id}`} className="hover:text-blue-600">
                                <h3 className="font-semibold text-lg">
                                  {agent.firstName} {agent.lastName}
                                </h3>
                              </Link>

                              {/* Badges */}
                              <div className="flex items-center gap-2 mt-1">
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
                              </div>

                              {/* Role & Experience */}
                              <p className="text-sm text-gray-500 mt-1">
                                {agent.agency ? agent.agency.name : t('privateBroker')}
                              </p>
                              <p className="text-xs text-gray-400">
                                {agent.yearsExperience} {tAgent('years')} {tAgent('onPlatform')}
                              </p>
                            </div>

                            {/* Listings Count */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-semibold">{agent.listingsCount} {t('properties')}</p>
                              <p className="text-xs text-gray-500">{t('inWork')}</p>
                            </div>
                          </div>

                          {/* Rating & Reviews */}
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold">{agent.avgRating || '0.0'}</span>
                              {renderStars(Math.round(agent.avgRating))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {agent.reviewCount} {tAgent('reviews')}
                            </span>
                          </div>

                          {/* Areas */}
                          {agent.areasServed.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {agent.areasServed.slice(0, 4).map((area) => (
                                <Badge key={area} variant="secondary" className="text-xs font-normal">
                                  <MapPin className="h-2.5 w-2.5 mr-1" />
                                  {area}
                                </Badge>
                              ))}
                              {agent.areasServed.length > 4 && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                  +{agent.areasServed.length - 4}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {agent.phone && (
                            <Button
                              size="sm"
                              className="gap-1"
                              onClick={(e) => {
                                e.preventDefault()
                                window.location.href = `tel:${agent.phone}`
                              }}
                            >
                              <Phone className="h-4 w-4" />
                              {t('call')}
                            </Button>
                          )}
                          {agent.whatsapp && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              onClick={(e) => {
                                e.preventDefault()
                                window.open(`https://wa.me/${agent.whatsapp?.replace(/\D/g, '')}`, '_blank')
                              }}
                            >
                              <MessageCircle className="h-4 w-4" />
                              WhatsApp
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            /* Agencies List */
            filteredAgencies.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t('noAgencies')}</h2>
                <p className="text-gray-500">{t('noAgenciesDesc')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAgencies.map((agency) => (
                  <Card key={agency.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <Link href={`/agencies/${agency.slug}`}>
                          <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border">
                            {agency.logo ? (
                              <Image
                                src={agency.logo}
                                alt={agency.name}
                                fill
                                className="object-contain p-2"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Building2 className="h-10 w-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Main Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link href={`/agencies/${agency.slug}`} className="hover:text-blue-600">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                  {agency.name}
                                  {agency.verified && (
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                  )}
                                </h3>
                              </Link>

                              {agency.city && (
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {agency.city}
                                </p>
                              )}

                              {agency.description && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                  {agency.description}
                                </p>
                              )}
                            </div>

                            {/* Stats */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-semibold">{agency.agentsCount} {t('agentsLabel')}</p>
                              <p className="text-sm text-gray-500">{agency.totalListings} {t('properties')}</p>
                            </div>
                          </div>

                          {/* Rating & Experience */}
                          <div className="flex items-center gap-6 mt-3">
                            {agency.avgRating > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">{agency.avgRating}</span>
                                {renderStars(Math.round(agency.avgRating))}
                                <span className="text-sm text-gray-500">
                                  ({agency.totalReviews})
                                </span>
                              </div>
                            )}
                            <span className="text-sm text-gray-500">
                              {agency.yearsOnPlatform} {tAgent('years')} {tAgent('onPlatform')}
                            </span>
                          </div>

                          {/* Agent Avatars Preview */}
                          {agency.agents.length > 0 && (
                            <div className="flex items-center gap-2 mt-3">
                              <div className="flex -space-x-2">
                                {agency.agents.slice(0, 5).map((agent) => (
                                  <div
                                    key={agent.id}
                                    className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-blue-500"
                                  >
                                    {agent.photo ? (
                                      <Image
                                        src={agent.photo}
                                        alt={`${agent.firstName} ${agent.lastName}`}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center text-white text-xs font-semibold">
                                        {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {agency.agentsCount > 5 && (
                                <span className="text-sm text-gray-500">
                                  +{agency.agentsCount - 5} {t('moreAgents')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Contact */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Link href={`/agencies/${agency.slug}`}>
                            <Button size="sm" className="w-full">
                              {t('viewAgency')}
                            </Button>
                          </Link>
                          {agency.phone && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={(e) => {
                                e.preventDefault()
                                window.location.href = `tel:${agency.phone}`
                              }}
                            >
                              <Phone className="h-4 w-4" />
                              {t('call')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </MainLayout>
  )
}
