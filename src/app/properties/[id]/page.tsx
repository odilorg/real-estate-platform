import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { MainLayout } from '@/components/layout'
import { ImageGallery } from '@/components/properties/ImageGallery'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { ContactOwnerButton } from '@/components/properties/ContactOwnerButton'
import { PropertyPageActions, PropertySidebarActions } from '@/components/properties/PropertyPageActions'
import { ReviewsSection } from '@/components/reviews/ReviewsSection'
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
} from 'lucide-react'
import { getPropertyById, getAllProperties, incrementPropertyViews } from '@/lib/db'
import { LABELS } from '@/lib/validations/property'

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  const { userId } = await auth()
  const property = await getPropertyById(id)

  if (!property) {
    notFound()
  }

  // Increment view count
  await incrementPropertyViews(id)

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
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/properties" className="hover:text-blue-600">
                Properties
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
              {/* Title and Actions */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary">
                        {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                      </Badge>
                      <Badge variant="outline">{getLabel('propertyType', property.propertyType)}</Badge>
                      {property.buildingClass && (
                        <Badge className="bg-purple-100 text-purple-800">
                          {getLabel('buildingClass', property.buildingClass)}
                        </Badge>
                      )}
                      {property.verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    {property.buildingName && (
                      <p className="text-lg text-blue-600 font-medium mb-2">{property.buildingName}</p>
                    )}
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-1" />
                      <span>
                        {property.address}, {property.city}
                        {property.district && `, ${property.district}`}
                        {property.state && `, ${property.state}`}
                        {property.zipCode && ` ${property.zipCode}`}
                      </span>
                    </div>
                    {property.nearestMetro && (
                      <div className="flex items-center text-gray-600 mt-1">
                        <Train className="h-4 w-4 mr-1" />
                        <span>
                          {property.nearestMetro}
                          {property.metroDistance && ` (${property.metroDistance} min walk)`}
                        </span>
                      </div>
                    )}
                  </div>
                  <PropertyPageActions
                    propertyId={property.id}
                    propertyTitle={property.title}
                    propertyPrice={property.price}
                    propertyCity={property.city}
                    ownerId={property.userId}
                  />
                </div>

                <div className="flex items-baseline gap-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                    {property.listingType === 'RENT' && (
                      <span className="text-lg text-gray-600 font-normal">/month</span>
                    )}
                  </div>
                  {pricePerSqFt && (
                    <div className="text-gray-600">
                      ${pricePerSqFt.toLocaleString()}/sq ft
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Bar */}
              <div className="bg-white rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {property.rooms && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <DoorOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-lg font-semibold">{property.rooms}</div>
                        <div className="text-xs text-gray-500">Rooms</div>
                      </div>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Maximize className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-lg font-semibold">{formatArea(property.area)}</div>
                        <div className="text-xs text-gray-500">sq ft total</div>
                      </div>
                    </div>
                  )}
                  {property.livingArea && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Ruler className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-lg font-semibold">{formatArea(property.livingArea)}</div>
                        <div className="text-xs text-gray-500">sq ft living</div>
                      </div>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-lg font-semibold">
                          {property.floor}/{property.totalFloors || '?'}
                        </div>
                        <div className="text-xs text-gray-500">Floor</div>
                      </div>
                    </div>
                  )}
                  {property.yearBuilt && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-lg font-semibold">{property.yearBuilt}</div>
                        <div className="text-xs text-gray-500">Year built</div>
                      </div>
                    </div>
                  )}
                  {property.ceilingHeight && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <ArrowUpDown className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-lg font-semibold">{property.ceilingHeight}</div>
                        <div className="text-xs text-gray-500">ft ceiling</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Gallery */}
              <div className="bg-white rounded-lg p-6">
                <ImageGallery images={property.images} alt={property.title} />
              </div>

              {/* About Apartment / About Building - CIAN Style Tabs */}
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="grid md:grid-cols-2 divide-x">
                  {/* About Apartment */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Home className="h-5 w-5 text-blue-600" />
                      About Apartment
                    </h3>
                    <div className="space-y-3 text-sm">
                      {property.rooms && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Rooms</span>
                          <span className="font-medium">{property.rooms}</span>
                        </div>
                      )}
                      {property.bedrooms && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Bedrooms</span>
                          <span className="font-medium">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Bathrooms</span>
                          <span className="font-medium">{property.bathrooms}</span>
                        </div>
                      )}
                      {property.area && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Total Area</span>
                          <span className="font-medium">{formatArea(property.area)} sq ft</span>
                        </div>
                      )}
                      {property.livingArea && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Living Area</span>
                          <span className="font-medium">{formatArea(property.livingArea)} sq ft</span>
                        </div>
                      )}
                      {property.kitchenArea && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Kitchen Area</span>
                          <span className="font-medium">{formatArea(property.kitchenArea)} sq ft</span>
                        </div>
                      )}
                      {property.floor && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Floor</span>
                          <span className="font-medium">{property.floor} of {property.totalFloors || '?'}</span>
                        </div>
                      )}
                      {property.ceilingHeight && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Ceiling Height</span>
                          <span className="font-medium">{property.ceilingHeight} ft</span>
                        </div>
                      )}
                      {(property.balcony !== null && property.balcony !== undefined && property.balcony > 0) && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Balconies</span>
                          <span className="font-medium">{property.balcony}</span>
                        </div>
                      )}
                      {(property.loggia !== null && property.loggia !== undefined && property.loggia > 0) && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Loggias</span>
                          <span className="font-medium">{property.loggia}</span>
                        </div>
                      )}
                      {property.bathroomType && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Bathroom</span>
                          <span className="font-medium">{getLabel('bathroomType', property.bathroomType)}</span>
                        </div>
                      )}
                      {property.windowView && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Window View</span>
                          <span className="font-medium">{getLabel('windowView', property.windowView)}</span>
                        </div>
                      )}
                      {property.renovation && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Renovation</span>
                          <span className="font-medium">{getLabel('renovation', property.renovation)}</span>
                        </div>
                      )}
                      {property.furnished && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Furnished</span>
                          <span className="font-medium">{getLabel('furnished', property.furnished)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* About Building */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      About Building
                    </h3>
                    <div className="space-y-3 text-sm">
                      {property.buildingName && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Building Name</span>
                          <span className="font-medium">{property.buildingName}</span>
                        </div>
                      )}
                      {property.buildingClass && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Building Class</span>
                          <span className="font-medium">{getLabel('buildingClass', property.buildingClass)}</span>
                        </div>
                      )}
                      {property.buildingType && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Building Type</span>
                          <span className="font-medium">{getLabel('buildingType', property.buildingType)}</span>
                        </div>
                      )}
                      {property.totalFloors && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Total Floors</span>
                          <span className="font-medium">{property.totalFloors}</span>
                        </div>
                      )}
                      {property.yearBuilt && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Year Built</span>
                          <span className="font-medium">{property.yearBuilt}</span>
                        </div>
                      )}
                      {(property.elevatorPassenger !== null && property.elevatorPassenger !== undefined && property.elevatorPassenger > 0) && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Passenger Elevators</span>
                          <span className="font-medium">{property.elevatorPassenger}</span>
                        </div>
                      )}
                      {(property.elevatorCargo !== null && property.elevatorCargo !== undefined && property.elevatorCargo > 0) && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Cargo Elevators</span>
                          <span className="font-medium">{property.elevatorCargo}</span>
                        </div>
                      )}
                      {property.parking && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Parking</span>
                          <span className="font-medium">
                            {property.parking} space{property.parking > 1 ? 's' : ''}
                            {property.parkingType && ` (${getLabel('parkingType', property.parkingType)})`}
                          </span>
                        </div>
                      )}

                      {/* Building Features */}
                      <div className="pt-2">
                        <span className="text-gray-600 text-xs uppercase tracking-wider">Features</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {property.hasGarbageChute && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                              <Trash2 className="h-3 w-3 mr-1" />
                              Garbage Chute
                            </span>
                          )}
                          {property.hasConcierge && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              Concierge
                            </span>
                          )}
                          {property.hasGatedArea && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Gated Community
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities & Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center">
                          <Check className="h-5 w-5 text-green-600 mr-2" />
                          <span>{amenity.replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews Section */}
              <Card>
                <CardContent className="pt-6">
                  <ReviewsSection propertyId={property.id} />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Owner */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Interested in this property? Send a message to the owner to get more details
                    or schedule a viewing.
                  </p>
                  <ContactOwnerButton
                    propertyId={property.id}
                    ownerId={property.userId}
                    currentUserId={userId || undefined}
                  />
                  <PropertySidebarActions
                    propertyId={property.id}
                    propertyTitle={property.title}
                    ownerId={property.userId}
                  />
                </CardContent>
              </Card>

              {/* Property Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID:</span>
                    <span className="font-semibold text-xs">#{property.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold">{getLabel('propertyType', property.propertyType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold">
                      {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                  {pricePerSqFt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price/sq ft:</span>
                      <span className="font-semibold">${pricePerSqFt.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted:</span>
                    <span className="font-semibold">
                      {property.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Views:
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
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {property.district && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-semibold">{property.district}</span>
                      </div>
                    )}
                    {property.nearestMetro && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Train className="h-4 w-4 mr-1" />
                          Metro:
                        </span>
                        <span className="font-semibold">{property.nearestMetro}</span>
                      </div>
                    )}
                    {property.metroDistance && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Walk to metro:</span>
                        <span className="font-semibold">{property.metroDistance} min</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Similar Properties in {property.city}</h2>
              <div className="space-y-4">
                {similarProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
