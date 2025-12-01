import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getTranslations } from 'next-intl/server'
import { MainLayout } from '@/components/layout'
import { ImageGallery } from '@/components/properties/ImageGallery'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { ContactOwnerButton } from '@/components/properties/ContactOwnerButton'
import { FavoriteButton } from '@/components/properties/FavoriteButton'
import { PropertyPageActions, PropertySidebarActions } from '@/components/properties/PropertyPageActions'
import { PropertyMapSection } from '@/components/properties/PropertyMap'
import { MortgageCalculator } from '@/components/properties/MortgageCalculator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Building,
  Home,
  Check,
  Eye,
  Car,
  Ruler,
  ArrowUpDown,
  Train,
  Shield,
  Paintbrush,
  Sofa,
  DoorOpen,
  Mountain,
  Building2,
  Users,
  Package,
  Trash2,
  MessageCircle,
  Heart,
  TrendingUp,
  CheckCircle2,
  Zap,
  Droplets,
  Flame,
  TreePine,
  Route,
  FileText,
  School,
  ShoppingBag,
  Hospital,
  Landmark,
} from 'lucide-react'
import { getPropertyById, getAllProperties, incrementPropertyViews, getPropertySocialProof } from '@/lib/db'
import { getAgentByUserId, getAgentListingsCount } from '@/lib/agents'
import { LABELS } from '@/lib/validations/property'
import { AgentSidebar } from '@/components/agents/AgentSidebar'
import { InquiryForm } from '@/components/property/InquiryForm'
import { PriceHistory } from '@/components/property/PriceHistory'
import { NeighborhoodSection } from '@/components/property/NeighborhoodSection'

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  const session = await getSession()
  const userId = session?.user?.id
  const property = await getPropertyById(id)
  const t = await getTranslations('properties.details')
  const tAmenities = await getTranslations('amenities')

  if (!property) {
    notFound()
  }

  // Increment view count and get social proof data
  await incrementPropertyViews(id)
  const socialProof = await getPropertySocialProof(id)

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

  // Calculate price per square foot
  const pricePerSqFt = property.area ? Math.round(property.price / property.area) : null

  // Get similar properties (same city, different id)
  const allProperties = await getAllProperties()
  const similarProperties = allProperties
    .filter((p) => p.city === property.city && p.id !== property.id)
    .slice(0, 3)

  // Helper to get label for enum values
  const getLabel = (category: keyof typeof LABELS, value: string | null | undefined) => {
    if (!value) return null
    const categoryLabels = LABELS[category] as Record<string, string>
    return categoryLabels?.[value] || value
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">
                {t('breadcrumb.home')}
              </Link>
              <span className="mx-2">/</span>
              <Link href="/properties" className="hover:text-blue-600">
                {t('breadcrumb.properties')}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{property.title}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title Section - Cian Style */}
              <div className="bg-white rounded-lg p-6">
                {/* Badges Row */}
                {property.verified && (
                  <div className="mb-3">
                    <Badge className="bg-green-500 text-white font-semibold px-3 py-1">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      {t('badges.verifiedListing')}
                    </Badge>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {property.listingType === 'SALE' ? t('badges.forSale') : t('badges.forRent')}{' '}
                  {property.rooms ? `${property.rooms}-${t('stats.room')} ` : ''}
                  {t(`propertyTypes.${property.propertyType.toLowerCase()}`)}
                  {property.area ? `, ${property.area} ${t('stats.sqm')}` : ''}
                </h1>

                {/* Building Name */}
                {property.buildingName && (
                  <p className="text-lg text-blue-600 font-medium mb-3">
                    {t('sections.inBuilding')} «{property.buildingName}»
                  </p>
                )}

                {/* Location Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 text-sm mb-3">
                  <span>
                    {property.city}
                    {property.district && `, ${property.district}`}
                    {property.state && `, ${property.state}`}
                  </span>
                  <PropertyPageActions
                    propertyId={property.id}
                    propertyTitle={property.title}
                    propertyPrice={property.price}
                    propertyCity={property.city}
                    ownerId={property.userId}
                    latitude={property.latitude}
                    longitude={property.longitude}
                    propertyType={property.propertyType}
                    listingType={property.listingType}
                    address={property.address}
                    state={property.state}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area}
                    livingArea={property.livingArea}
                    kitchenArea={property.kitchenArea}
                    rooms={property.rooms}
                    floor={property.floor}
                    totalFloors={property.totalFloors}
                    yearBuilt={property.yearBuilt}
                    parking={property.parking}
                    balcony={property.balcony}
                    buildingType={property.buildingType}
                    buildingClass={property.buildingClass}
                    renovation={property.renovation}
                    furnished={property.furnished}
                    images={property.images}
                    amenities={property.amenities}
                    variant="inline"
                  />
                </div>

                {/* Metro Info */}
                {property.nearestMetro && (
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Train className="h-4 w-4 mr-1 text-red-500" />
                      <span>{property.nearestMetro}</span>
                      {property.metroDistance && (
                        <span className="ml-1 text-gray-500">
                          {property.metroDistance} {t('minWalk')}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons Row - Cian Style */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                  <PropertyPageActions
                    propertyId={property.id}
                    propertyTitle={property.title}
                    propertyPrice={property.price}
                    propertyCity={property.city}
                    ownerId={property.userId}
                    latitude={property.latitude}
                    longitude={property.longitude}
                    propertyType={property.propertyType}
                    listingType={property.listingType}
                    address={property.address}
                    state={property.state}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area}
                    livingArea={property.livingArea}
                    kitchenArea={property.kitchenArea}
                    rooms={property.rooms}
                    floor={property.floor}
                    totalFloors={property.totalFloors}
                    yearBuilt={property.yearBuilt}
                    parking={property.parking}
                    balcony={property.balcony}
                    buildingType={property.buildingType}
                    buildingClass={property.buildingClass}
                    renovation={property.renovation}
                    furnished={property.furnished}
                    images={property.images}
                    amenities={property.amenities}
                    variant="buttons"
                  />
                </div>
              </div>

              {/* Quick Stats Bar */}
              <div className="bg-white rounded-lg p-3 md:p-4">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                  {property.rooms && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <DoorOpen className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm md:text-lg font-semibold">{property.rooms}</div>
                        <div className="text-[10px] md:text-xs text-gray-500">{t('stats.rooms')}</div>
                      </div>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <Maximize className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm md:text-lg font-semibold truncate">{formatArea(property.area)}</div>
                        <div className="text-[10px] md:text-xs text-gray-500">{t('stats.sqft')}</div>
                      </div>
                    </div>
                  )}
                  {property.livingArea && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <Ruler className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm md:text-lg font-semibold truncate">{formatArea(property.livingArea)}</div>
                        <div className="text-[10px] md:text-xs text-gray-500">{t('stats.living')}</div>
                      </div>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <Building className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm md:text-lg font-semibold">
                          {property.floor}/{property.totalFloors || '?'}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500">{t('stats.floor')}</div>
                      </div>
                    </div>
                  )}
                  {property.yearBuilt && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm md:text-lg font-semibold">{property.yearBuilt}</div>
                        <div className="text-[10px] md:text-xs text-gray-500">{t('stats.built')}</div>
                      </div>
                    </div>
                  )}
                  {property.ceilingHeight && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <ArrowUpDown className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm md:text-lg font-semibold">{property.ceilingHeight}</div>
                        <div className="text-[10px] md:text-xs text-gray-500">{t('stats.ceiling')}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Gallery */}
              <div className="bg-white rounded-lg p-6">
                <ImageGallery images={property.images} alt={property.title} />
              </div>

              {/* Property Details - Type Specific */}
              {property.propertyType === 'LAND' ? (
                /* Land Property Details */
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="grid md:grid-cols-2 divide-x">
                    {/* Land Details */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TreePine className="h-5 w-5 text-green-600" />
                        {t('sections.landDetails')}
                      </h3>
                      <div className="space-y-3 text-sm">
                        {property.area && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.plotSize')}</span>
                            <span className="font-medium">{formatArea(property.area)} {t('stats.sqft')}</span>
                          </div>
                        )}
                        {pricePerSqFt && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.pricePerSqFt')}</span>
                            <span className="font-medium">${pricePerSqFt}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">{t('listingType')}</span>
                          <span className="font-medium">{property.listingType === 'SALE' ? t('badges.forSale') : t('badges.forRent')}</span>
                        </div>
                        {property.district && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.district')}</span>
                            <span className="font-medium">{property.district}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Utilities & Access */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        {t('sections.utilitiesAccess')}
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                            <Zap className="h-5 w-5 text-green-600" />
                            <span className="text-sm">{t('utilities.electricity')}</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                            <Droplets className="h-5 w-5 text-blue-600" />
                            <span className="text-sm">{t('utilities.water')}</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                            <Flame className="h-5 w-5 text-orange-600" />
                            <span className="text-sm">{t('utilities.gas')}</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Route className="h-5 w-5 text-gray-600" />
                            <span className="text-sm">{t('utilities.roadAccess')}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {t('utilities.contactAgentToConfirm')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : property.propertyType === 'COMMERCIAL' ? (
                /* Commercial Property Details */
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="grid md:grid-cols-2 divide-x">
                    {/* Space Details */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-600" />
                        {t('sections.spaceDetails')}
                      </h3>
                      <div className="space-y-3 text-sm">
                        {property.area && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.totalArea')}</span>
                            <span className="font-medium">{formatArea(property.area)} {t('stats.sqft')}</span>
                          </div>
                        )}
                        {property.floor && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('floor')}</span>
                            <span className="font-medium">{property.floor} / {property.totalFloors || '?'}</span>
                          </div>
                        )}
                        {property.ceilingHeight && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.ceilingHeight')}</span>
                            <span className="font-medium">{property.ceilingHeight} м</span>
                          </div>
                        )}
                        {property.parking && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.parking')}</span>
                            <span className="font-medium">{property.parking} {t('fields.spaces')}</span>
                          </div>
                        )}
                        {property.buildingClass && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('buildingClass')}</span>
                            <span className="font-medium">{getLabel('buildingClass', property.buildingClass)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Building Info */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        {t('sections.buildingInfo')}
                      </h3>
                      <div className="space-y-3 text-sm">
                        {property.buildingName && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.building')}</span>
                            <span className="font-medium">{property.buildingName}</span>
                          </div>
                        )}
                        {property.totalFloors && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('totalFloors')}</span>
                            <span className="font-medium">{property.totalFloors}</span>
                          </div>
                        )}
                        {property.yearBuilt && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('yearBuilt')}</span>
                            <span className="font-medium">{property.yearBuilt}</span>
                          </div>
                        )}
                        {(property.elevatorPassenger || property.elevatorCargo) && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.elevators')}</span>
                            <span className="font-medium">
                              {property.elevatorPassenger || 0} {t('passenger')}, {property.elevatorCargo || 0} {t('cargo')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Residential Property Details (Apartment/House) */
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="grid md:grid-cols-2 divide-x">
                    {/* About Property */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Home className="h-5 w-5 text-blue-600" />
                        {property.propertyType === 'HOUSE' ? t('sections.aboutHouse') : t('sections.aboutApartment')}
                      </h3>
                      <div className="space-y-3 text-sm">
                        {property.rooms && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.rooms')}</span>
                            <span className="font-medium">{property.rooms}</span>
                          </div>
                        )}
                        {property.bedrooms && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.bedrooms')}</span>
                            <span className="font-medium">{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.bathrooms')}</span>
                            <span className="font-medium">{property.bathrooms}</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.totalArea')}</span>
                            <span className="font-medium">{formatArea(property.area)} {t('stats.sqft')}</span>
                          </div>
                        )}
                        {property.livingArea && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.livingArea')}</span>
                            <span className="font-medium">{formatArea(property.livingArea)} {t('stats.sqft')}</span>
                          </div>
                        )}
                        {property.kitchenArea && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.kitchenArea')}</span>
                            <span className="font-medium">{formatArea(property.kitchenArea)} {t('stats.sqft')}</span>
                          </div>
                        )}
                        {property.floor && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('floor')}</span>
                            <span className="font-medium">{property.floor} / {property.totalFloors || '?'}</span>
                          </div>
                        )}
                        {property.ceilingHeight && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.ceilingHeight')}</span>
                            <span className="font-medium">{property.ceilingHeight} м</span>
                          </div>
                        )}
                        {(property.balcony !== null && property.balcony !== undefined && property.balcony > 0) && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.balconies')}</span>
                            <span className="font-medium">{property.balcony}</span>
                          </div>
                        )}
                        {property.renovation && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('renovation')}</span>
                            <span className="font-medium">{getLabel('renovation', property.renovation)}</span>
                          </div>
                        )}
                        {property.furnished && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.furnished')}</span>
                            <span className="font-medium">{getLabel('furnished', property.furnished)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* About Building */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        {t('sections.aboutBuilding')}
                      </h3>
                      <div className="space-y-3 text-sm">
                        {property.buildingName && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.buildingName')}</span>
                            <span className="font-medium">{property.buildingName}</span>
                          </div>
                        )}
                        {property.buildingClass && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('buildingClass')}</span>
                            <span className="font-medium">{getLabel('buildingClass', property.buildingClass)}</span>
                          </div>
                        )}
                        {property.buildingType && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.buildingType')}</span>
                            <span className="font-medium">{getLabel('buildingType', property.buildingType)}</span>
                          </div>
                        )}
                        {property.totalFloors && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('totalFloors')}</span>
                            <span className="font-medium">{property.totalFloors}</span>
                          </div>
                        )}
                        {property.yearBuilt && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('yearBuilt')}</span>
                            <span className="font-medium">{property.yearBuilt}</span>
                          </div>
                        )}
                        {(property.elevatorPassenger !== null && property.elevatorPassenger !== undefined && property.elevatorPassenger > 0) && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.passengerElevators')}</span>
                            <span className="font-medium">{property.elevatorPassenger}</span>
                          </div>
                        )}
                        {property.parking && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('fields.parking')}</span>
                            <span className="font-medium">
                              {property.parking} {property.parking > 1 ? t('fields.spaces') : t('fields.space')}
                            </span>
                          </div>
                        )}

                        {/* Building Features */}
                        {(property.hasGarbageChute || property.hasConcierge || property.hasGatedArea) && (
                          <div className="pt-2">
                            <span className="text-gray-600 text-xs uppercase tracking-wider">{t('features.title')}</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {property.hasGarbageChute && (
                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  {t('features.garbageChute')}
                                </span>
                              )}
                              {property.hasConcierge && (
                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                                  <Users className="h-3 w-3 mr-1" />
                                  {t('features.concierge')}
                                </span>
                              )}
                              {property.hasGatedArea && (
                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {t('features.gatedCommunity')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('description')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
                </CardContent>
              </Card>

              {/* Map */}
              <Card id="property-map">
                <CardContent className="pt-6">
                  <PropertyMapSection
                    latitude={property.latitude}
                    longitude={property.longitude}
                    title={property.title}
                    address={`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`}
                  />
                </CardContent>
              </Card>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('sections.amenitiesFeatures')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center">
                          <Check className="h-5 w-5 text-green-600 mr-2" />
                          <span>{tAmenities(amenity.toLowerCase().replace(/_/g, ''))}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Neighborhood Highlights - Dynamic from OpenStreetMap */}
              <NeighborhoodSection
                latitude={property.latitude}
                longitude={property.longitude}
                district={property.district}
                city={property.city}
              />

              {/* Similar Properties - Inside Main Content */}
              {similarProperties.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('similarPropertiesIn', { city: property.city })}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {similarProperties.map((prop) => (
                      <PropertyCard key={prop.id} property={prop} />
                    ))}
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card - Cian Style */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        {formatPrice(property.price)}
                        {property.listingType === 'RENT' && (
                          <span className="text-lg text-gray-500 font-normal"> /{t('perMonth')}</span>
                        )}
                      </div>
                      {pricePerSqFt && (
                        <div className="text-sm text-gray-500 mt-1">
                          {t('pricePerSqFt')}: ${pricePerSqFt.toLocaleString()}/{t('stats.sqm')}
                        </div>
                      )}
                    </div>
                    <FavoriteButton propertyId={property.id} />
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-2 py-4 border-t border-gray-100">
                    {property.propertyType && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{t('propertyType')}</span>
                        <span className="font-medium">{getLabel('propertyType', property.propertyType)}</span>
                      </div>
                    )}
                    {property.listingType && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{t('listingType')}</span>
                        <span className="font-medium">
                          {property.listingType === 'SALE' ? t('badges.forSale') : t('badges.forRent')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Agent/Owner Contact - CIAN style */}
              <AgentSidebar
                ownerId={property.userId}
                propertyId={property.id}
              />

              {/* Inquiry Form - Only show if not owner */}
              {userId !== property.userId && (
                <InquiryForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
              )}

              {/* Property Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('propertyInformation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('propertyId')}:</span>
                    <span className="font-semibold text-xs">#{property.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('propertyType')}:</span>
                    <span className="font-semibold">{getLabel('propertyType', property.propertyType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('status')}:</span>
                    <span className="font-semibold">
                      {property.listingType === 'SALE' ? t('badges.forSale') : t('badges.forRent')}
                    </span>
                  </div>
                  {pricePerSqFt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('pricePerSqFt')}:</span>
                      <span className="font-semibold">${pricePerSqFt.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('posted')}:</span>
                    <span className="font-semibold">
                      {property.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {t('views')}:
                    </span>
                    <span className="font-semibold">{property.views}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Location Info */}
              {(property.nearestMetro || property.district) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {t('location')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {property.district && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('fields.district')}:</span>
                        <span className="font-semibold">{property.district}</span>
                      </div>
                    )}
                    {property.nearestMetro && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Train className="h-4 w-4 mr-1" />
                          {t('fields.metro')}:
                        </span>
                        <span className="font-semibold">{property.nearestMetro}</span>
                      </div>
                    )}
                    {property.metroDistance && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('walkToMetro')}:</span>
                        <span className="font-semibold">{property.metroDistance} {t('minutes')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Price History */}
              <PriceHistory propertyId={property.id} currentPrice={property.price} />

              {/* Mortgage Calculator (only for properties for sale) */}
              {property.listingType === 'SALE' && (
                <MortgageCalculator propertyPrice={property.price} />
              )}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}
