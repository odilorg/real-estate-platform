"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { MainLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Home,
  Eye,
  Heart,
  Calendar,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Building2,
  CheckCircle,
  Clock,
  PlusCircle,
  ArrowRight,
  Loader2,
  BadgeCheck,
  Award,
} from 'lucide-react'

interface AgentStats {
  agent: {
    id: string
    firstName: string
    lastName: string
    photo: string | null
    verified: boolean
    superAgent: boolean
    rating: number
    reviewCount: number
    yearsExperience: number
    totalDeals: number
    agency: { name: string } | null
  }
  stats: {
    totalListings: number
    activeListings: number
    soldListings: number
    rentedListings: number
    totalViews: number
    totalFavorites: number
    pendingViewings: number
    confirmedViewings: number
    conversations: number
    unreadMessages: number
    newListingsThisMonth: number
    viewingsThisMonth: number
  }
  recentListings: Array<{
    id: string
    title: string
    price: number
    status: string
    listingType: string
    views: number
    favorites: number
    image: string | null
    createdAt: string
  }>
  recentReviews: Array<{
    id: string
    rating: number
    comment: string | null
    dealType: string | null
    createdAt: string
  }>
  recentViewings: Array<{
    id: string
    propertyId: string
    date: string
    time: string
    status: string
    message: string | null
  }>
}

export default function AgentDashboardPage() {
  const { data: session, status } = useSession()
  const isLoaded = status !== 'loading'
  const user = session?.user
  const router = useRouter()
  const t = useTranslations('agent.dashboard')
  const [data, setData] = useState<AgentStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in?redirect_url=/agent/dashboard')
      return
    }

    if (user) {
      loadStats()
    }
  }, [isLoaded, user, router])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/agent/stats')
      if (res.status === 403) {
        setError('not_agent')
        return
      }
      if (!res.ok) throw new Error('Failed to load stats')
      const data = await res.json()
      setData(data)
    } catch (err) {
      console.error('Error loading agent stats:', err)
      setError('error')
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

  if (!isLoaded || isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    )
  }

  if (error === 'not_agent') {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-bold mb-2">{t('errors.accessRequired')}</h2>
              <p className="text-gray-600 mb-4">
                {t('errors.accessRequiredDesc')}
              </p>
              <Link href="/become-agent">
                <Button>{t('errors.applyToBecome')}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">{t('errors.failedToLoad')}</p>
        </div>
      </MainLayout>
    )
  }

  const { agent, stats, recentListings, recentReviews, recentViewings } = data

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-6">
              {/* Agent Photo */}
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {agent.photo ? (
                    <img src={agent.photo} alt={agent.firstName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold">
                      {agent.firstName[0]}{agent.lastName[0]}
                    </span>
                  )}
                </div>
                {agent.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <BadgeCheck className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">
                    {agent.firstName} {agent.lastName}
                  </h1>
                  {agent.superAgent && (
                    <Badge className="bg-yellow-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Super Agent
                    </Badge>
                  )}
                </div>
                <p className="text-blue-100">
                  {agent.agency?.name || t('independentAgent')}
                  {agent.yearsExperience > 0 && ` • ${agent.yearsExperience} ${t('yearsExperience')}`}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {agent.rating > 0 ? agent.rating.toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-blue-200">({agent.reviewCount} {t('recentReviews.title').toLowerCase()})</span>
                  </div>
                  <div className="text-blue-200">
                    {agent.totalDeals} {t('dealsClosed')}
                  </div>
                </div>
              </div>

              <Link href="/properties/new">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t('addListing')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeListings}</p>
                    <p className="text-xs text-gray-500">{t('stats.activeListings')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{t('stats.totalViews')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalFavorites}</p>
                    <p className="text-xs text-gray-500">{t('stats.favorites')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingViewings}</p>
                    <p className="text-xs text-gray-500">{t('stats.pendingViewings')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.unreadMessages}</p>
                    <p className="text-xs text-gray-500">{t('stats.unreadMessages')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.soldListings + stats.rentedListings}</p>
                    <p className="text-xs text-gray-500">{t('stats.closedDeals')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t('performance.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">{t('performance.listingsStatus')}</span>
                        <span className="text-sm font-medium">{stats.totalListings} {t('performance.total')}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-sm flex-1">{t('performance.active')}</span>
                          <span className="text-sm font-medium">{stats.activeListings}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-sm flex-1">{t('performance.sold')}</span>
                          <span className="text-sm font-medium">{stats.soldListings}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                          <span className="text-sm flex-1">{t('performance.rented')}</span>
                          <span className="text-sm font-medium">{stats.rentedListings}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">{t('performance.thisMonth')}</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{t('performance.newListings')}</span>
                            <span className="font-medium">{stats.newListingsThisMonth}</span>
                          </div>
                          <Progress value={Math.min(stats.newListingsThisMonth * 20, 100)} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{t('performance.viewings')}</span>
                            <span className="font-medium">{stats.viewingsThisMonth}</span>
                          </div>
                          <Progress value={Math.min(stats.viewingsThisMonth * 10, 100)} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Listings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    {t('recentListings.title')}
                  </CardTitle>
                  <Link href="/dashboard?tab=properties">
                    <Button variant="ghost" size="sm">
                      {t('recentListings.viewAll')} <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentListings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>{t('recentListings.noListings')}</p>
                      <Link href="/properties/new">
                        <Button className="mt-4" size="sm">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          {t('recentListings.addFirst')}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentListings.map((listing) => (
                        <Link key={listing.id} href={`/properties/${listing.id}`}>
                          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="h-16 w-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {listing.image ? (
                                <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Home className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{listing.title}</h4>
                              <p className="text-blue-600 font-semibold">
                                {formatPrice(listing.price)}
                                {listing.listingType === 'RENT' && '/mo'}
                              </p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <div className="flex items-center gap-1 justify-end">
                                <Eye className="h-4 w-4" />
                                {listing.views}
                              </div>
                              <div className="flex items-center gap-1 justify-end">
                                <Heart className="h-4 w-4" />
                                {listing.favorites}
                              </div>
                            </div>
                            <Badge
                              className={
                                listing.status === 'ACTIVE'
                                  ? 'bg-green-100 text-green-800'
                                  : listing.status === 'SOLD'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {listing.status === 'ACTIVE' ? t('status.active') : listing.status === 'SOLD' ? t('status.sold') : t('status.rented')}
                            </Badge>
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
              {/* Upcoming Viewings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-5 w-5" />
                    {t('upcomingViewings.title')}
                  </CardTitle>
                  <Link href="/dashboard?tab=viewings">
                    <Button variant="ghost" size="sm">{t('upcomingViewings.viewAll')}</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentViewings.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">{t('upcomingViewings.noViewings')}</p>
                  ) : (
                    <div className="space-y-3">
                      {recentViewings.map((viewing) => (
                        <div key={viewing.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                          <div className={`p-2 rounded-lg ${
                            viewing.status === 'CONFIRMED' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            {viewing.status === 'CONFIRMED' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {new Date(viewing.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">{viewing.time}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {viewing.status === 'CONFIRMED' ? t('status.confirmed') : t('status.pending')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Star className="h-5 w-5" />
                    {t('recentReviews.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentReviews.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">{t('recentReviews.noReviews')}</p>
                  ) : (
                    <div className="space-y-4">
                      {recentReviews.map((review) => (
                        <div key={review.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            {review.dealType && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {t(`dealTypes.${review.dealType.toLowerCase()}`)}
                              </Badge>
                            )}
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('quickActions.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/properties/new" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {t('quickActions.addNewListing')}
                    </Button>
                  </Link>
                  <Link href="/dashboard?tab=messages" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {t('quickActions.viewMessages')}
                      {stats.unreadMessages > 0 && (
                        <Badge className="ml-auto">{stats.unreadMessages}</Badge>
                      )}
                    </Button>
                  </Link>
                  <Link href="/dashboard?tab=viewings" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('quickActions.manageViewings')}
                      {stats.pendingViewings > 0 && (
                        <Badge variant="outline" className="ml-auto">{stats.pendingViewings}</Badge>
                      )}
                    </Button>
                  </Link>
                  <Link href="/dashboard?tab=properties" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-2" />
                      {t('quickActions.manageListings')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
