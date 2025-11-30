"use client"

import { useState, useEffect, use } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { MainLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MapPin,
  Home,
  TrendingUp,
  TrendingDown,
  Bed,
  Bath,
  Maximize,
  ArrowLeft,
  Loader2,
  Building2,
  DollarSign,
  BarChart3,
} from 'lucide-react'

interface Property {
  id: string
  title: string
  price: number
  listingType: string
  propertyType: string
  address: string
  city: string
  state: string | null
  district: string | null
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  images: string[]
}

interface District {
  name: string
  count: number
  avgPrice: number
}

interface CityStats {
  totalProperties: number
  forSale: number
  forRent: number
  avgPrice: number
  minPrice: number
  maxPrice: number
}

export default function CityAreaPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: encodedCity } = use(params)
  const city = decodeURIComponent(encodedCity)
  const [stats, setStats] = useState<CityStats | null>(null)
  const [districts, setDistricts] = useState<District[]>([])
  const [propertyTypes, setPropertyTypes] = useState<Record<string, number>>({})
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadAreaData()
  }, [city])

  const loadAreaData = async () => {
    try {
      const res = await fetch(`/api/areas/${encodeURIComponent(city)}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setDistricts(data.districts)
        setPropertyTypes(data.propertyTypes)
        setProperties(data.properties)
      }
    } catch (error) {
      console.error('Error loading area data:', error)
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

  const formatShortPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    return `$${(price / 1000).toFixed(0)}K`
  }

  const filteredProperties = properties.filter((p) => {
    if (activeTab === 'all') return true
    if (activeTab === 'sale') return p.listingType === 'SALE'
    if (activeTab === 'rent') return p.listingType === 'RENT'
    return true
  })

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-12">
            <Link href="/areas" className="inline-flex items-center text-white/80 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Areas
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-8 w-8" />
              <h1 className="text-4xl font-bold">{city}</h1>
            </div>
            <p className="text-white/80 text-lg">
              Explore {stats?.totalProperties || 0} properties in {city}
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.totalProperties}</p>
                  <p className="text-sm text-gray-500">Total Properties</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.forSale}</p>
                  <p className="text-sm text-gray-500">For Sale</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{stats.forRent}</p>
                  <p className="text-sm text-gray-500">For Rent</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{formatShortPrice(stats.avgPrice)}</p>
                  <p className="text-sm text-gray-500">Avg. Price</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-600">{formatShortPrice(stats.minPrice)}</p>
                  <p className="text-sm text-gray-500">Min Price</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-600">{formatShortPrice(stats.maxPrice)}</p>
                  <p className="text-sm text-gray-500">Max Price</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Districts */}
              {districts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Districts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {districts.slice(0, 10).map((district) => (
                      <div
                        key={district.name}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{district.name}</p>
                          <p className="text-sm text-gray-500">{district.count} properties</p>
                        </div>
                        <Badge variant="outline">{formatShortPrice(district.avgPrice)}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Property Types */}
              {Object.keys(propertyTypes).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Property Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(propertyTypes).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-gray-600">{type}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/properties?city=${encodeURIComponent(city)}&type=sale`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-2" />
                      Properties for Sale
                    </Button>
                  </Link>
                  <Link href={`/properties?city=${encodeURIComponent(city)}&type=rent`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-2" />
                      Properties for Rent
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Properties List */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-6">
                  <TabsList>
                    <TabsTrigger value="all">All ({properties.length})</TabsTrigger>
                    <TabsTrigger value="sale">For Sale ({stats?.forSale || 0})</TabsTrigger>
                    <TabsTrigger value="rent">For Rent ({stats?.forRent || 0})</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab}>
                  {filteredProperties.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Home className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No properties found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {filteredProperties.map((property) => (
                        <Link key={property.id} href={`/properties/${property.id}`}>
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                {/* Image */}
                                <div className="relative h-28 w-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                  {property.images[0] ? (
                                    <Image
                                      src={property.images[0]}
                                      alt={property.title}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <Home className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                  <Badge
                                    className={`absolute top-2 left-2 ${
                                      property.listingType === 'SALE'
                                        ? 'bg-green-600'
                                        : 'bg-purple-600'
                                    }`}
                                  >
                                    {property.listingType === 'SALE' ? 'Sale' : 'Rent'}
                                  </Badge>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-lg line-clamp-1 hover:text-blue-600">
                                    {property.title}
                                  </h3>
                                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                                    <MapPin className="h-3 w-3" />
                                    {property.address}
                                    {property.district && `, ${property.district}`}
                                  </p>

                                  <p className="text-xl font-bold text-blue-600 mb-2">
                                    {formatPrice(property.price)}
                                    {property.listingType === 'RENT' && (
                                      <span className="text-sm font-normal text-gray-500">/mo</span>
                                    )}
                                  </p>

                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    {property.bedrooms && (
                                      <span className="flex items-center gap-1">
                                        <Bed className="h-4 w-4" /> {property.bedrooms} beds
                                      </span>
                                    )}
                                    {property.bathrooms && (
                                      <span className="flex items-center gap-1">
                                        <Bath className="h-4 w-4" /> {property.bathrooms} baths
                                      </span>
                                    )}
                                    {property.area && (
                                      <span className="flex items-center gap-1">
                                        <Maximize className="h-4 w-4" /> {property.area} m²
                                      </span>
                                    )}
                                    <Badge variant="outline">{property.propertyType}</Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
