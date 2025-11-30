"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  MapPin,
  Home,
  TrendingUp,
  Search,
  Loader2,
  Building2,
} from 'lucide-react'

interface Area {
  city: string
  count: number
  minPrice: number
  maxPrice: number
  avgPrice: number
  districtCount: number
}

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadAreas()
  }, [])

  const loadAreas = async () => {
    try {
      const res = await fetch('/api/areas')
      if (res.ok) {
        const data = await res.json()
        setAreas(data.areas || [])
      }
    } catch (error) {
      console.error('Error loading areas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    return `$${(price / 1000).toFixed(0)}K`
  }

  const filteredAreas = areas.filter((area) =>
    area.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Explore Areas</h1>
            <p className="text-gray-600 mb-6">
              Discover neighborhoods and find properties in your favorite areas
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Areas Grid */}
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredAreas.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No areas found</h2>
              <p className="text-gray-500">
                {searchQuery
                  ? 'Try a different search term'
                  : 'No properties have been listed yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAreas.map((area) => (
                <Link key={area.city} href={`/areas/${encodeURIComponent(area.city)}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    {/* Gradient Header */}
                    <div className="h-24 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-white/80" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-xl font-semibold mb-1">{area.city}</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {area.districtCount} districts
                      </p>

                      {/* Stats */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-gray-600 text-sm">
                            <Home className="h-4 w-4" />
                            Properties
                          </span>
                          <span className="font-semibold">{area.count}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-gray-600 text-sm">
                            <TrendingUp className="h-4 w-4" />
                            Avg. Price
                          </span>
                          <span className="font-semibold text-blue-600">
                            {formatPrice(area.avgPrice)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Price Range</span>
                          <span>
                            {formatPrice(area.minPrice)} - {formatPrice(area.maxPrice)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
