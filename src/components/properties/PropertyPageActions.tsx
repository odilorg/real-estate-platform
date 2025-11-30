"use client"

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { ShareProperty } from './ShareProperty'
import { ScheduleViewing } from './ScheduleViewing'
import { FavoriteButton } from './FavoriteButton'
import { PropertyPDF } from '@/components/property/PropertyPDF'

interface PropertyForPDF {
  id: string
  title: string
  description: string
  price: number
  listingType: string
  propertyType: string
  address: string
  city: string
  state?: string | null
  country: string
  bedrooms?: number | null
  bathrooms?: number | null
  area?: number | null
  livingArea?: number | null
  kitchenArea?: number | null
  rooms?: number | null
  floor?: number | null
  totalFloors?: number | null
  yearBuilt?: number | null
  parking?: number | null
  balcony?: number | null
  buildingType?: string | null
  buildingClass?: string | null
  renovation?: string | null
  furnished?: string | null
  nearestMetro?: string | null
  metroDistance?: number | null
  images: string[]
  amenities?: string[]
}

interface PropertyPageActionsProps {
  propertyId: string
  propertyTitle: string
  propertyPrice: number
  propertyCity: string
  ownerId: string
  property?: PropertyForPDF
}

export function PropertyPageActions({
  propertyId,
  propertyTitle,
  propertyPrice,
  propertyCity,
  ownerId,
  property,
}: PropertyPageActionsProps) {
  const { isSignedIn } = useUser()

  // Track recently viewed
  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/recently-viewed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      }).catch(console.error)
    }
  }, [isSignedIn, propertyId])

  return (
    <div className="flex gap-2">
      <FavoriteButton propertyId={propertyId} />
      <ShareProperty
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        propertyPrice={propertyPrice}
        propertyCity={propertyCity}
      />
      {property && <PropertyPDF property={property} />}
    </div>
  )
}

export function PropertySidebarActions({
  propertyId,
  propertyTitle,
  ownerId,
}: {
  propertyId: string
  propertyTitle: string
  ownerId: string
}) {
  return (
    <ScheduleViewing
      propertyId={propertyId}
      propertyTitle={propertyTitle}
      ownerId={ownerId}
    />
  )
}
