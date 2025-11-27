"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, Bed, Bath, ArrowRight } from 'lucide-react'

interface Property {
  id: string
  title: string
  price: number
  propertyType: string
  listingType: string
  city: string
  state?: string
  bedrooms?: number
  bathrooms?: number
  images: string[]
}

export function RecentlyViewed() {
  const { isSignedIn } = useUser()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSignedIn) {
      fetchRecentlyViewed()
    } else {
      setLoading(false)
    }
  }, [isSignedIn])

  const fetchRecentlyViewed = async () => {
    try {
      const response = await fetch('/api/recently-viewed')
      if (response.ok) {
        const data = await response.json()
        setProperties(data.slice(0, 4)) // Only show 4
      }
    } catch (error) {
      console.error('Error fetching recently viewed:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (!isSignedIn || loading || properties.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          Recently Viewed
        </CardTitle>
        <Link href="/dashboard?tab=favorites">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-32">
                  <Image
                    src={property.images[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3">
                  <p className="font-bold text-blue-600">
                    {formatPrice(property.price)}
                    {property.listingType === 'RENT' && (
                      <span className="text-xs text-gray-500 font-normal">/mo</span>
                    )}
                  </p>
                  <h4 className="font-medium text-sm line-clamp-1 mt-1">
                    {property.title}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.city}{property.state ? `, ${property.state}` : ''}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    {property.bedrooms && (
                      <span className="flex items-center">
                        <Bed className="h-3 w-3 mr-1" />
                        {property.bedrooms}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center">
                        <Bath className="h-3 w-3 mr-1" />
                        {property.bathrooms}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
