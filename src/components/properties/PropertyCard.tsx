import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MapPin, Bed, Bath, Maximize, Calendar } from 'lucide-react'
import type { MockProperty } from '@/lib/mockData'

interface PropertyCardProps {
  property: MockProperty
}

export function PropertyCard({ property }: PropertyCardProps) {
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-64 h-48 md:h-auto">
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
              className="bg-white/90 text-gray-900 hover:bg-white"
            >
              {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-600/90 text-white hover:bg-blue-600"
            >
              {property.propertyType}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Section */}
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col h-full justify-between">
            {/* Price and Title */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                  {property.listingType === 'RENT' && (
                    <span className="text-sm text-gray-600 font-normal">/month</span>
                  )}
                </span>
              </div>

              <Link
                href={`/properties/${property.id}`}
                className="block hover:text-blue-600 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {property.title}
                </h3>
              </Link>

              <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.address}, {property.city}, {property.state}</span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {property.description}
              </p>
            </div>

            {/* Property Details */}
            <div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{property.bedrooms} bed</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{property.bathrooms} bath</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center">
                    <Maximize className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{formatArea(property.area)} sq ft</span>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span>Built {property.yearBuilt}</span>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {property.amenities.slice(0, 4).map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="outline"
                      className="text-xs"
                    >
                      {amenity.replace('_', ' ')}
                    </Badge>
                  ))}
                  {property.amenities.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{property.amenities.length - 4} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
