"use client"

import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PropertyRating } from './PropertyRating'
import { Heart, MapPin, Bed, Bath, Maximize, Calendar, GitCompare, Check, Map, Printer, Flag, Phone, Building2, Shield, Eye, EyeOff } from 'lucide-react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useComparison } from '@/contexts/ComparisonContext'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Property } from '@/types'

interface PropertyCardProps {
  property: Property
  compact?: boolean
}

export function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addToComparison, removeFromComparison, isInComparison } = useComparison()
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const t = useTranslations('property')
  const tAgent = useTranslations('agent')
  const [showPhone, setShowPhone] = useState(false)
  const favorite = isFavorite(property.id)
  const inComparison = isInComparison(property.id)

  // Handle print
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`/properties/${property.id}?print=true`, '_blank')
  }

  // Handle report
  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.info(t('signInToReport') || 'Please sign in to report', {
        action: {
          label: t('signIn') || 'Sign In',
          onClick: () => router.push('/sign-in'),
        },
      })
      return
    }
    // Open report modal or navigate to report page
    toast.info(t('reportReceived') || 'Thank you for your report. We will review it shortly.')
  }

  // Handle map click
  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (property.latitude && property.longitude) {
      router.push(`/properties?view=map&lat=${property.latitude}&lng=${property.longitude}&zoom=15`)
    } else {
      router.push(`/properties?view=map&city=${encodeURIComponent(property.city)}`)
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Prompt to sign in if not logged in
    if (!user) {
      toast.info('Please sign in to save favorites', {
        action: {
          label: 'Sign In',
          onClick: () => router.push('/sign-in'),
        },
      })
      return
    }

    await toggleFavorite(property.id)
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inComparison) {
      removeFromComparison(property.id)
    } else {
      addToComparison({
        id: property.id,
        title: property.title,
        price: property.price,
        listingType: property.listingType,
        propertyType: property.propertyType,
        address: property.address,
        city: property.city,
        state: property.state ?? undefined,
        bedrooms: property.bedrooms ?? undefined,
        bathrooms: property.bathrooms ?? undefined,
        area: property.area ?? undefined,
        livingArea: property.livingArea ?? undefined,
        kitchenArea: property.kitchenArea ?? undefined,
        rooms: property.rooms ?? undefined,
        floor: property.floor ?? undefined,
        totalFloors: property.totalFloors ?? undefined,
        yearBuilt: property.yearBuilt ?? undefined,
        parking: property.parking ?? undefined,
        balcony: property.balcony ?? undefined,
        buildingType: property.buildingType ?? undefined,
        buildingClass: property.buildingClass ?? undefined,
        renovation: property.renovation ?? undefined,
        furnished: property.furnished ?? undefined,
        images: property.images,
        amenities: property.amenities,
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatArea = (area: number) => {
    return new Intl.NumberFormat('en-US').format(area)
  }

  // Compact version for split view
  if (compact) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <Link href={`/properties/${property.id}`}>
          <div className="flex">
            {/* Image */}
            <div className="relative w-28 h-24 flex-shrink-0">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Content */}
            <div className="flex-1 p-3 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-blue-600">
                    {formatPrice(property.price)}
                    {property.listingType === 'RENT' && <span className="text-sm font-normal">/mo</span>}
                  </p>
                  <h3 className="font-medium text-sm truncate">{property.title}</h3>
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {property.city}{property.state && `, ${property.state}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 flex-shrink-0"
                  onClick={handleFavoriteClick}
                >
                  <Heart className={`h-4 w-4 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </Button>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600 mt-2">
                {property.bedrooms && (
                  <span className="flex items-center gap-1">
                    <Bed className="h-3 w-3" /> {property.bedrooms}
                  </span>
                )}
                {property.bathrooms && (
                  <span className="flex items-center gap-1">
                    <Bath className="h-3 w-3" /> {property.bathrooms}
                  </span>
                )}
                {property.area && (
                  <span className="flex items-center gap-1">
                    <Maximize className="h-3 w-3" /> {formatArea(property.area)} sqft
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section: Image + Property Info */}
        <div className="flex flex-col md:flex-row flex-1">
          {/* Image Section */}
          <div className="relative w-full md:w-56 lg:w-64 h-48 md:h-auto flex-shrink-0">
            <Link href={`/properties/${property.id}`}>
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
              />
            </Link>
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge
                variant="secondary"
                className="bg-white/90 text-gray-900 hover:bg-white text-xs"
              >
                {property.listingType === 'SALE' ? t('forSale') : t('forRent')}
              </Badge>
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCompareClick}
                className={`h-8 w-8 transition-colors ${
                  inComparison
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-white/90 hover:bg-white text-gray-600'
                }`}
                title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
              >
                {inComparison ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteClick}
                className={`h-8 w-8 transition-colors ${
                  favorite
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white/90 hover:bg-white text-gray-600'
                }`}
              >
                <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="flex-1 p-4">
            <div className="flex flex-col h-full">
              {/* Title - Cian style */}
              <Link
                href={`/properties/${property.id}`}
                className="block hover:text-blue-600 transition-colors mb-1"
              >
                <h3 className="text-base font-medium line-clamp-1">
                  {property.rooms ? `${property.rooms}-${t('room')} ` : ''}
                  {property.propertyType.toLowerCase()}
                  {property.area ? `, ${property.area} ${t('sqm')}` : ''}
                  {property.floor && property.totalFloors ? `, ${property.floor}/${property.totalFloors} ${t('floor')}` : ''}
                </h3>
              </Link>

              {/* Property specs */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                {property.bedrooms && (
                  <span className="flex items-center gap-1">
                    <Bed className="h-3.5 w-3.5" /> {property.bedrooms}
                  </span>
                )}
                {property.bathrooms && (
                  <span className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                  </span>
                )}
                {property.area && (
                  <span className="flex items-center gap-1">
                    <Maximize className="h-3.5 w-3.5" /> {formatArea(property.area)} {t('sqm')}
                  </span>
                )}
                {property.yearBuilt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {property.yearBuilt}
                  </span>
                )}
              </div>

              {/* Location with map link */}
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{property.address}, {property.city}</span>
                <button
                  onClick={handleMapClick}
                  className="ml-2 text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 flex-shrink-0"
                >
                  {t('onMap')}
                </button>
              </div>

              {/* Price - prominent */}
              <div className="mb-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(property.price)}
                  {property.listingType === 'RENT' && (
                    <span className="text-sm text-gray-600 font-normal">/{t('perMonth') || 'mo'}</span>
                  )}
                </span>
                {property.area && (
                  <span className="text-sm text-gray-500 ml-2">
                    {formatPrice(Math.round(property.price / property.area))}/{t('sqm')}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">
                {property.description}
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t mt-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCompareClick}
                  className={`text-xs ${inComparison ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  <GitCompare className="h-3.5 w-3.5 mr-1" />
                  {t('compare')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  className="text-xs text-gray-500"
                >
                  <Printer className="h-3.5 w-3.5 mr-1" />
                  {t('print')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReport}
                  className="text-xs text-gray-500"
                >
                  <Flag className="h-3.5 w-3.5 mr-1" />
                  {t('report')}
                </Button>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Right Section: Seller/Agent Info */}
        <div className="lg:w-56 xl:w-64 border-t lg:border-t-0 lg:border-l p-4 bg-gray-50/50">
          {property.agent ? (
            <div className="space-y-3">
              {/* Agency info */}
              {property.agent.agency && (
                <Link
                  href={`/agencies/${property.agent.agency.id}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {property.agent.agency.logo ? (
                    <div className="w-10 h-10 relative rounded overflow-hidden bg-white border flex-shrink-0">
                      <Image
                        src={property.agent.agency.logo}
                        alt={property.agent.agency.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{tAgent('realEstateAgency')}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {property.agent.agency.name}
                    </p>
                  </div>
                </Link>
              )}

              {/* Agent info */}
              <Link
                href={`/agents/${property.agent.id}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {property.agent.photo ? (
                  <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={property.agent.photo}
                      alt={`${property.agent.firstName} ${property.agent.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {property.agent.firstName[0]}{property.agent.lastName[0]}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {property.agent.firstName} {property.agent.lastName}
                    </p>
                    {property.agent.verified && (
                      <Shield className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{tAgent('realtor')}</p>
                </div>
              </Link>

              {/* Phone button */}
              {property.agent.phone && property.agent.showPhone && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowPhone(!showPhone)
                  }}
                >
                  {showPhone ? (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      {property.agent.phone}
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      {tAgent('showPhone')}
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Private owner */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{tAgent('propertyOwner')}</p>
                  <p className="text-sm font-medium text-gray-900">{tAgent('privateOwner')}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(`/properties/${property.id}`)
                }}
              >
                {tAgent('contactOwner')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
