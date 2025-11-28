"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Heart, DollarSign, TrendingUp, PlusCircle, Eye, MessageSquare, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

interface PropertyStats {
  id: string
  title: string
  views: number
  status: string
  listingType: string
  _count: {
    favorites: number
    reviews: number
  }
}

interface Stats {
  totalProperties: number
  propertiesForSale: number
  propertiesForRent: number
  totalFavorites: number
  totalViews: number
  totalInquiries: number
  soldCount: number
  rentedCount: number
  topProperties: PropertyStats[]
}

export function OverviewTab() {
  const { user } = useUser()
  const t = useTranslations('dashboard')
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    propertiesForSale: 0,
    propertiesForRent: 0,
    totalFavorites: 0,
    totalViews: 0,
    totalInquiries: 0,
    soldCount: 0,
    rentedCount: 0,
    topProperties: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch detailed stats
      const statsResponse = await fetch('/api/users/me/stats')
      if (statsResponse.ok) {
        const data = await statsResponse.json()
        const properties = data.properties || []

        // Sort by views for top properties
        const topProperties = [...properties]
          .sort((a: PropertyStats, b: PropertyStats) => b.views - a.views)
          .slice(0, 5)

        setStats({
          totalProperties: data.totals?.properties || properties.length,
          propertiesForSale: properties.filter((p: PropertyStats) => p.listingType === 'SALE').length,
          propertiesForRent: properties.filter((p: PropertyStats) => p.listingType === 'RENT').length,
          totalFavorites: data.totals?.favorites || 0,
          totalViews: data.totals?.views || 0,
          totalInquiries: data.totals?.inquiries || 0,
          soldCount: data.totals?.sold || 0,
          rentedCount: data.totals?.rented || 0,
          topProperties,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: t('totalProperties'),
      value: stats.totalProperties,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: t('totalViews'),
      value: stats.totalViews,
      icon: Eye,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: t('inquiries'),
      value: stats.totalInquiries,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: t('favorites'),
      value: stats.totalFavorites,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: t('sold'),
      value: stats.soldCount,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: t('rented'),
      value: stats.rentedCount,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-2">
            {t('welcomeUser', { name: user?.firstName || 'User' })} 👋
          </h2>
          <p className="text-blue-100 mb-4">
            {t('heresWhatsHappening')}
          </p>
          <div className="flex gap-3">
            <Link href="/properties/new">
              <Button size="sm" variant="secondary">
                <PlusCircle className="h-4 w-4 mr-2" />
                {t('listNewProperty')}
              </Button>
            </Link>
            <Link href="/properties">
              <Button size="sm" variant="secondary">
                <Eye className="h-4 w-4 mr-2" />
                {t('browseProperties')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performing Properties */}
      {stats.topProperties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('topPerformingProperties')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProperties.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <Link href={`/properties/${property.id}`} className="font-medium hover:text-blue-600">
                        {property.title}
                      </Link>
                      <div className="text-sm text-gray-500">
                        {t('propertyStatus')}: <span className={`font-medium ${
                          property.status === 'ACTIVE' ? 'text-green-600' :
                          property.status === 'SOLD' ? 'text-blue-600' :
                          property.status === 'RENTED' ? 'text-purple-600' :
                          'text-gray-600'
                        }`}>{t(property.status.toLowerCase() as any)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{property.views}</div>
                      <div className="text-gray-500">{t('views')}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{property._count.favorites}</div>
                      <div className="text-gray-500">{t('favorites')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickActions')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard?tab=properties">
            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <Home className="h-5 w-5 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold">{t('manageProperties')}</div>
                <div className="text-sm text-gray-500">{t('managePropertiesDesc')}</div>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard?tab=favorites">
            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <Heart className="h-5 w-5 mr-3 text-red-600" />
              <div className="text-left">
                <div className="font-semibold">{t('viewFavorites')}</div>
                <div className="text-sm text-gray-500">{t('viewFavoritesDesc')}</div>
              </div>
            </Button>
          </Link>

          <Link href="/properties/new">
            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <PlusCircle className="h-5 w-5 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-semibold">{t('listNewProperty')}</div>
                <div className="text-sm text-gray-500">{t('addPropertyDesc')}</div>
              </div>
            </Button>
          </Link>

          <Link href="/properties">
            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <Eye className="h-5 w-5 mr-3 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold">{t('browseListings')}</div>
                <div className="text-sm text-gray-500">{t('browseListingsDesc')}</div>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
