"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Heart, DollarSign, TrendingUp, PlusCircle, Eye } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

interface Property {
  id: string
  listingType: string
}

export function OverviewTab() {
  const { user } = useUser()
  const [stats, setStats] = useState({
    totalProperties: 0,
    propertiesForSale: 0,
    propertiesForRent: 0,
    totalFavorites: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch user properties
      const propsResponse = await fetch('/api/users/me/properties')
      const properties: Property[] = propsResponse.ok ? await propsResponse.json() : []

      // Fetch favorites
      const favsResponse = await fetch('/api/favorites')
      const favorites = favsResponse.ok ? await favsResponse.json() : []

      setStats({
        totalProperties: properties.length,
        propertiesForSale: properties.filter((p) => p.listingType === 'SALE').length,
        propertiesForRent: properties.filter((p) => p.listingType === 'RENT').length,
        totalFavorites: favorites.length,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'For Sale',
      value: stats.propertiesForSale,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'For Rent',
      value: stats.propertiesForRent,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Saved Favorites',
      value: stats.totalFavorites,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
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
            Welcome back, {user?.firstName || 'User'}! 👋
          </h2>
          <p className="text-blue-100 mb-4">
            Here's what's happening with your properties today
          </p>
          <div className="flex gap-3">
            <Link href="/properties/new">
              <Button size="sm" variant="secondary">
                <PlusCircle className="h-4 w-4 mr-2" />
                List New Property
              </Button>
            </Link>
            <Link href="/properties">
              <Button size="sm" variant="secondary">
                <Eye className="h-4 w-4 mr-2" />
                Browse Properties
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard?tab=properties">
            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <Home className="h-5 w-5 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold">Manage Properties</div>
                <div className="text-sm text-gray-500">Edit or delete your listings</div>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard?tab=favorites">
            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <Heart className="h-5 w-5 mr-3 text-red-600" />
              <div className="text-left">
                <div className="font-semibold">View Favorites</div>
                <div className="text-sm text-gray-500">See properties you've saved</div>
              </div>
            </Button>
          </Link>

          <Link href="/properties/new">
            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <PlusCircle className="h-5 w-5 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-semibold">List New Property</div>
                <div className="text-sm text-gray-500">Add a property to the platform</div>
              </div>
            </Button>
          </Link>

          <Link href="/properties">
            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <Eye className="h-5 w-5 mr-3 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold">Browse Listings</div>
                <div className="text-sm text-gray-500">Discover new properties</div>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
