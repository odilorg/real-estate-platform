"use client"

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { ShareProperty } from './ShareProperty'
import { ScheduleViewing } from './ScheduleViewing'
import { FavoriteButton } from './FavoriteButton'

interface PropertyPageActionsProps {
  propertyId: string
  propertyTitle: string
  propertyPrice: number
  propertyCity: string
  ownerId: string
}

export function PropertyPageActions({
  propertyId,
  propertyTitle,
  propertyPrice,
  propertyCity,
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
