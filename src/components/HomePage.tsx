'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MapPin,
  Home,
  Building2,
  Warehouse,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Bed,
  Bath,
  Maximize,
  Heart,
  ChevronRight,
  Star,
  Shield,
  Clock,
  Loader2
} from "lucide-react"

interface Property {
  id: string
  title: string
  price: number
  listingType: string
  propertyType: string
  address: string
  city: string
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  images: string[]
  createdAt: string
}

interface Area {
  city: string
  count: number
  avgPrice: number
}

interface Stats {
  totalProperties: number
  totalAgents: number
  totalUsers: number
  citiesCovered: number
}

export function HomePage() {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const { data: session, status } = useSession()
  const isSignedIn = status === 'authenticated'
  const user = session?.user

  const [listingType, setListingType] = useState<'buy' | 'rent'>('buy')
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [recentProperties, setRecentProperties] = useState<Property[]>([])
  const [popularAreas, setPopularAreas] = useState<Area[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHomeData()
  }, [])

  useEffect(() => {
    if (isSignedIn) {
      loadRecentlyViewed()
    }
  }, [isSignedIn])

  const loadHomeData = async () => {
    try {
      const res = await fetch('/api/home')
      if (res.ok) {
        const data = await res.json()
        setFeaturedProperties(data.featured || [])
        setRecentProperties(data.recent || [])
        setPopularAreas(data.popularAreas || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecentlyViewed = async () => {
    try {
      const res = await fetch('/api/users/me/recently-viewed')
      if (res.ok) {
        const data = await res.json()
        setRecentlyViewed(data.properties || [])
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const type = listingType === 'buy' ? 'SALE' : 'RENT'
    const params = new URLSearchParams()
    params.set('listingType', type)
    if (searchQuery) {
      params.set('query', searchQuery)
    }
    router.push(`/properties?${params.toString()}`)
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

  return (
    <>
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100/80">
              {t('hero.subtitle')}
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-2xl p-2 md:p-3 max-w-3xl mx-auto">
              {/* Buy/Rent Tabs */}
              <Tabs value={listingType} onValueChange={(v) => setListingType(v as 'buy' | 'rent')} className="mb-3">
                <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2">
                  <TabsTrigger value="buy" className="text-sm font-medium">
                    {tCommon('buy')}
                  </TabsTrigger>
                  <TabsTrigger value="rent" className="text-sm font-medium">
                    {tCommon('rent')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={t('hero.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-gray-900 border-gray-200 text-base"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                  <Search className="h-5 w-5 mr-2" />
                  {tCommon('search')}
                </Button>
              </form>

              {/* Quick Links */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Link href={`/properties?type=${listingType === 'buy' ? 'SALE' : 'RENT'}&propertyType=APARTMENT`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200 transition-colors">
                    <Building2 className="h-3 w-3 mr-1" />
                    {tCommon('apartments')}
                  </Badge>
                </Link>
                <Link href={`/properties?type=${listingType === 'buy' ? 'SALE' : 'RENT'}&propertyType=HOUSE`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200 transition-colors">
                    <Home className="h-3 w-3 mr-1" />
                    {tCommon('houses')}
                  </Badge>
                </Link>
                <Link href={`/properties?type=${listingType === 'buy' ? 'SALE' : 'RENT'}&propertyType=COMMERCIAL`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200 transition-colors">
                    <Warehouse className="h-3 w-3 mr-1" />
                    {tCommon('commercial')}
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {stats && (
        <section className="bg-white border-b py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-600">{stats.totalProperties.toLocaleString()}+</p>
                <p className="text-sm text-gray-500">{t('stats.activeListings')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{stats.totalAgents.toLocaleString()}+</p>
                <p className="text-sm text-gray-500">{t('stats.verifiedAgents')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">{stats.totalUsers.toLocaleString()}+</p>
                <p className="text-sm text-gray-500">{t('stats.happyUsers')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-600">{stats.citiesCovered}+</p>
                <p className="text-sm text-gray-500">{t('stats.citiesCovered')}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed - Only for signed in users */}
      {isSignedIn && recentlyViewed.length > 0 && (
        <section className="py-10 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">{t('recentlyViewed.title')}</h2>
              </div>
              <Link href="/dashboard?tab=history" className="text-blue-600 hover:underline text-sm flex items-center">
                {t('recentlyViewed.viewAll')}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {recentlyViewed.slice(0, 6).map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`} className="flex-shrink-0 w-64">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <div className="relative h-36">
                      {property.images[0] ? (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-t-lg">
                          <Home className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <p className="font-semibold text-blue-600">{formatPrice(property.price)}</p>
                      <p className="text-sm text-gray-600 truncate">{property.title}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{t('featured.title')}</h2>
              <p className="text-gray-600 mt-1">{t('featured.subtitle')}</p>
            </div>
            <Link href="/properties">
              <Button variant="outline">
                {t('featured.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.slice(0, 8).map((property) => (
                <PropertyCard key={property.id} property={property} formatPrice={formatPrice} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">{t('featured.noProperties')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Areas */}
      {popularAreas.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">{t('areas.title')}</h2>
                <p className="text-gray-600 mt-1">{t('areas.subtitle')}</p>
              </div>
              <Link href="/areas">
                <Button variant="outline">
                  {t('areas.viewAll')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularAreas.slice(0, 6).map((area) => (
                <Link key={area.city} href={`/areas/${encodeURIComponent(area.city)}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer overflow-hidden group">
                    <div className="h-24 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-800 transition-colors">
                      <MapPin className="h-10 w-10 text-white/80" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{area.city}</h3>
                      <p className="text-sm text-gray-500">{area.count} {tCommon('properties')}</p>
                      <p className="text-sm font-medium text-blue-600 mt-1">
                        {t('areas.avgPrice')}: {formatShortPrice(area.avgPrice)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Properties */}
      {recentProperties.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">{t('recent.title')}</h2>
                <p className="text-gray-600 mt-1">{t('recent.subtitle')}</p>
              </div>
              <Link href="/properties?sort=newest">
                <Button variant="outline">
                  {t('recent.viewAll')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProperties.slice(0, 4).map((property) => (
                <PropertyCard key={property.id} property={property} formatPrice={formatPrice} isNew />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Property Types */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {t('propertyTypes.title')}
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            {t('propertyTypes.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/properties?propertyType=APARTMENT,HOUSE,CONDO">
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Home className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('propertyTypes.residential')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('propertyTypes.residentialDesc')}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/properties?propertyType=COMMERCIAL">
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('propertyTypes.commercial')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('propertyTypes.commercialDesc')}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/properties?propertyType=LAND">
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Warehouse className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('propertyTypes.land')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('propertyTypes.landDesc')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 md:py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {t('trust.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 mb-4">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('trust.verified')}</h3>
              <p className="text-gray-400 text-sm">
                {t('trust.verifiedDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-600 mb-4">
                <CheckCircle className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('trust.secure')}</h3>
              <p className="text-gray-400 text-sm">
                {t('trust.secureDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-600 mb-4">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('trust.support')}</h3>
              <p className="text-gray-400 text-sm">
                {t('trust.supportDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - For Sellers */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties/new">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {t('cta.listProperty')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/become-agent">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white/20">
                {t('cta.becomeAgent')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// Property Card Component
function PropertyCard({
  property,
  formatPrice,
  isNew = false
}: {
  property: Property
  formatPrice: (price: number) => string
  isNew?: boolean
}) {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <Home className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={property.listingType === 'SALE' ? 'bg-green-600' : 'bg-purple-600'}>
              {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
            </Badge>
            {isNew && (
              <Badge className="bg-amber-500">New</Badge>
            )}
          </div>

          {/* Favorite Button */}
          <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <p className="text-xl font-bold text-blue-600 mb-1">
            {formatPrice(property.price)}
            {property.listingType === 'RENT' && (
              <span className="text-sm font-normal text-gray-500">/mo</span>
            )}
          </p>
          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{property.address}, {property.city?.nameEn || ''}</span>
          </p>

          {/* Property Details */}
          <div className="flex items-center gap-3 text-sm text-gray-600 border-t pt-3">
            {property.bedrooms && (
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {property.bathrooms}
              </span>
            )}
            {property.area && (
              <span className="flex items-center gap-1">
                <Maximize className="h-4 w-4" />
                {property.area} m²
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
