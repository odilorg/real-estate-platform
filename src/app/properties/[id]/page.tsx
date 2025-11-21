import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { MainLayout } from '@/components/layout'
import { ImageGallery } from '@/components/properties/ImageGallery'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { ContactOwnerButton } from '@/components/properties/ContactOwnerButton'
import { ReviewsSection } from '@/components/reviews/ReviewsSection'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Heart,
  Share2,
  Building,
  Home,
  Check,
} from 'lucide-react'
import { getDataStore } from '@/lib/dataStore'

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  const { userId } = await auth()
  const dataStore = getDataStore()
  const property = dataStore.getPropertyById(id)

  if (!property) {
    notFound()
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

  // Get similar properties (same city, different id)
  const allProperties = dataStore.getAllProperties()
  const similarProperties = allProperties
    .filter((p) => p.city === property.city && p.id !== property.id)
    .slice(0, 3)

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
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary">
                        {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                      </Badge>
                      <Badge variant="outline">{property.propertyType}</Badge>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-1" />
                      <span>
                        {property.address}, {property.city}, {property.state} {property.zipCode}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="text-4xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                  {property.listingType === 'RENT' && (
                    <span className="text-lg text-gray-600 font-normal">/month</span>
                  )}
                </div>
              </div>

              {/* Image Gallery */}
              <div className="bg-white rounded-lg p-6">
                <ImageGallery images={property.images} alt={property.title} />
              </div>

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {property.bedrooms && (
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Bed className="h-5 w-5 mr-2" />
                          <span className="text-sm">Bedrooms</span>
                        </div>
                        <span className="text-xl font-semibold">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Bath className="h-5 w-5 mr-2" />
                          <span className="text-sm">Bathrooms</span>
                        </div>
                        <span className="text-xl font-semibold">{property.bathrooms}</span>
                      </div>
                    )}
                    {property.area && (
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Maximize className="h-5 w-5 mr-2" />
                          <span className="text-sm">Area</span>
                        </div>
                        <span className="text-xl font-semibold">{formatArea(property.area)} sq ft</span>
                      </div>
                    )}
                    {property.yearBuilt && (
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span className="text-sm">Year Built</span>
                        </div>
                        <span className="text-xl font-semibold">{property.yearBuilt}</span>
                      </div>
                    )}
                    {property.floor && (
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Building className="h-5 w-5 mr-2" />
                          <span className="text-sm">Floor</span>
                        </div>
                        <span className="text-xl font-semibold">
                          {property.floor}/{property.totalFloors}
                        </span>
                      </div>
                    )}
                    {property.parking && (
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Home className="h-5 w-5 mr-2" />
                          <span className="text-sm">Parking</span>
                        </div>
                        <span className="text-xl font-semibold">{property.parking} spaces</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
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
                    <span className="font-semibold">#{property.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold">
                      {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted:</span>
                    <span className="font-semibold">
                      {property.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
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
