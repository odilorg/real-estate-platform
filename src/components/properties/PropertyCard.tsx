"use client"

import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PropertyRating } from './PropertyRating'
import { ContactModal } from '@/components/agents/ContactModal'
import { Heart, MapPin, Bed, Bath, Maximize, Calendar, GitCompare, Check, Map, Printer, Flag, Phone, Building2, Shield, Eye, EyeOff, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
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
  const [showContactModal, setShowContactModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const favorite = isFavorite(property.id)
  const inComparison = isInComparison(property.id)

  // Get city name for display (from location object)
  const cityName = property.city?.nameEn || ''
  // Image gallery navigation
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const selectImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  // Handle print - open property page and trigger print
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Open property in new tab and print after load
    const printWindow = window.open(`/properties/${property.id}`, '_blank')
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => printWindow.print(), 500)
      }
    }
  }

  // Handle message button click
  const handleMessageClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.info('Please sign in to send messages', {
        action: {
          label: 'Sign In',
          onClick: () => router.push('/sign-in'),
        },
      })
      return
    }
    setShowContactModal(true)
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
      router.push(`/properties?view=map&city=${encodeURIComponent(cityName)}`)
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
        city: cityName,
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
                    {cityName}{property.state && `, ${property.state}`}
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
    <Card className="group overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section: Image Gallery + Property Info */}
        <div className="flex flex-col sm:flex-row flex-1">
          {/* Image Gallery Section - Cian style large */}
          <div className="relative w-full sm:w-64 md:w-80 lg:w-96 flex-shrink-0">
            {/* Main Image */}
            <div className="relative h-52 sm:h-48 md:h-56 lg:h-60">
              <Link href={`/properties/${property.id}`}>
                <Image
                  src={property.images[currentImageIndex] || property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </Link>

              {/* Navigation Arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-gray-900 hover:bg-white text-xs px-1.5 py-0.5"
                >
                  {property.listingType === 'SALE' ? t('forSale') : t('forRent')}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCompareClick}
                  className={`h-7 w-7 transition-colors ${
                    inComparison
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-white/90 hover:bg-white text-gray-600'
                  }`}
                  title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
                >
                  {inComparison ? <Check className="h-3.5 w-3.5" /> : <GitCompare className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteClick}
                  className={`h-7 w-7 transition-colors ${
                    favorite
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-white/90 hover:bg-white text-gray-600'
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${favorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Image Counter */}
              {property.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {currentImageIndex + 1}/{property.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <div className="hidden sm:flex gap-1 p-1.5 bg-gray-100">
                {property.images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => selectImage(index, e)}
                    className={`relative flex-1 h-14 md:h-16 overflow-hidden rounded-sm ${
                      currentImageIndex === index ? 'ring-2 ring-blue-500' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${property.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {/* "More photos" overlay on last thumbnail */}
                    {index === 3 && property.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          +{property.images.length - 4}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <CardContent className="flex-1 p-3 sm:p-4">
            <div className="flex flex-col h-full">
              {/* Title - Cian style: actual title as prominent blue link */}
              <Link
                href={`/properties/${property.id}`}
                className="block text-blue-600 hover:text-blue-800 hover:underline transition-colors mb-2"
              >
                <h3 className="text-lg sm:text-xl font-bold line-clamp-2">
                  {property.title}
                </h3>
              </Link>

              {/* Property type and specs line - h4 for SEO hierarchy */}
              <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                {property.rooms ? `${property.rooms}-${t('room')} ` : ''}
                {property.propertyType.toLowerCase()}
                {property.area ? `, ${property.area} ${t('sqm')}` : ''}
                {property.floor && property.totalFloors ? `, ${property.floor}/${property.totalFloors} ${t('floor')}` : ''}
              </h4>

              {/* Property specs */}
              <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600 mb-2">
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
              <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{property.address}, {cityName}</span>
                <button
                  onClick={handleMapClick}
                  className="ml-2 text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 flex-shrink-0 text-xs sm:text-sm"
                >
                  {t('onMap')}
                </button>
              </div>

              {/* Price - prominent */}
              <div className="mb-2">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatPrice(property.price)}
                  {property.listingType === 'RENT' && (
                    <span className="text-xs sm:text-sm text-gray-600 font-normal">/{t('perMonth') || 'mo'}</span>
                  )}
                </span>
                {property.area && (
                  <span className="text-xs sm:text-sm text-gray-500 ml-2 hidden sm:inline">
                    {formatPrice(Math.round(property.price / property.area))}/{t('sqm')}
                  </span>
                )}
              </div>

              {/* Description - 2 lines max */}
              <p className="hidden sm:block text-sm text-gray-600 line-clamp-2 mb-3">
                {property.description}
              </p>

              {/* Action buttons - Icons only on mobile, with text on larger screens */}
              <div className="flex items-center gap-1 sm:gap-2 pt-2 border-t mt-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCompareClick}
                  className={`text-xs px-2 sm:px-3 ${inComparison ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  <GitCompare className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">{t('compare')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  className="text-xs text-gray-500 px-2 sm:px-3"
                >
                  <Printer className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">{t('print')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReport}
                  className="text-xs text-gray-500 px-2 sm:px-3"
                >
                  <Flag className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">{t('report')}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Right Section: Seller/Agent Info - Hidden on small mobile */}
        <div className="hidden sm:block lg:w-48 xl:w-52 border-t lg:border-t-0 lg:border-l p-3 bg-gray-50/50">
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

              {/* Write message button */}
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={handleMessageClick}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {tAgent('writeMessage')}
              </Button>
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
                onClick={handleMessageClick}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {tAgent('writeMessage')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        propertyId={property.id}
        property={{
          title: property.title,
          price: property.price,
          currency: 'USD',
          image: property.images[0] || null,
        }}
        recipient={{
          name: property.agent
            ? `${property.agent.firstName} ${property.agent.lastName}`
            : tAgent('privateOwner') || 'Private Owner',
          photo: property.agent?.photo,
          isAgent: !!property.agent,
        }}
      />
    </Card>
  )
}
