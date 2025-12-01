"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { ShareProperty } from './ShareProperty'
import { ScheduleViewing } from './ScheduleViewing'
import { FavoriteButton } from './FavoriteButton'
import { Button } from '@/components/ui/button'
import { useComparison } from '@/contexts/ComparisonContext'
import { Map, Printer, Flag, GitCompare, Check, Share2, Download, Edit3 } from 'lucide-react'

interface PropertyPageActionsProps {
  propertyId: string
  propertyTitle: string
  propertyPrice: number
  propertyCity: string
  ownerId: string
  latitude?: number | null
  longitude?: number | null
  propertyType?: string
  listingType?: string
  address?: string
  state?: string | null
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
  images?: string[]
  amenities?: string[]
  variant?: 'inline' | 'buttons' | 'default'
}

export function PropertyPageActions({
  propertyId,
  propertyTitle,
  propertyPrice,
  propertyCity,
  latitude,
  longitude,
  propertyType,
  listingType,
  address,
  state,
  bedrooms,
  bathrooms,
  area,
  livingArea,
  kitchenArea,
  rooms,
  floor,
  totalFloors,
  yearBuilt,
  parking,
  balcony,
  buildingType,
  buildingClass,
  renovation,
  furnished,
  images,
  amenities,
  variant = 'default',
}: PropertyPageActionsProps) {
  const { data: session, status } = useSession()
  const isSignedIn = status === 'authenticated'
  const user = session?.user
  const router = useRouter()
  const t = useTranslations('property')
  const { addToComparison, removeFromComparison, isInComparison } = useComparison()
  const inComparison = isInComparison(propertyId)

  // Track recently viewed
  useEffect(() => {
    if (isSignedIn && variant === 'buttons') {
      fetch('/api/recently-viewed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      }).catch(console.error)
    }
  }, [isSignedIn, propertyId, variant])

  // Handle map click - scroll to map section
  const handleMapClick = () => {
    const mapElement = document.getElementById('property-map')
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle print
  const handlePrint = () => {
    window.open(`/properties/${propertyId}?print=true`, '_blank')
  }

  // Handle report
  const handleReport = () => {
    if (!user) {
      toast.info(t('signInToReport') || 'Please sign in to report', {
        action: {
          label: t('signIn') || 'Sign In',
          onClick: () => router.push('/sign-in'),
        },
      })
      return
    }
    toast.info(t('reportReceived') || 'Thank you for your report. We will review it shortly.')
  }

  // Handle compare
  const handleCompareClick = () => {
    if (inComparison) {
      removeFromComparison(propertyId)
    } else {
      addToComparison({
        id: propertyId,
        title: propertyTitle,
        price: propertyPrice,
        listingType: listingType || 'SALE',
        propertyType: propertyType || 'APARTMENT',
        address: address || '',
        city: propertyCity,
        state: state ?? undefined,
        bedrooms: bedrooms ?? undefined,
        bathrooms: bathrooms ?? undefined,
        area: area ?? undefined,
        livingArea: livingArea ?? undefined,
        kitchenArea: kitchenArea ?? undefined,
        rooms: rooms ?? undefined,
        floor: floor ?? undefined,
        totalFloors: totalFloors ?? undefined,
        yearBuilt: yearBuilt ?? undefined,
        parking: parking ?? undefined,
        balcony: balcony ?? undefined,
        buildingType: buildingType ?? undefined,
        buildingClass: buildingClass ?? undefined,
        renovation: renovation ?? undefined,
        furnished: furnished ?? undefined,
        images: images || [],
        amenities: amenities || [],
      })
    }
  }

  // Inline variant - just the "На карте" link
  if (variant === 'inline') {
    return (
      <button
        onClick={handleMapClick}
        className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
      >
        {t('onMap')}
      </button>
    )
  }

  // Buttons variant - Cian style action buttons row
  if (variant === 'buttons') {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCompareClick}
          className={`text-sm border-gray-300 ${inComparison ? 'bg-blue-50 border-blue-300 text-blue-600' : ''}`}
        >
          {inComparison ? <Check className="h-4 w-4 mr-1.5" /> : <GitCompare className="h-4 w-4 mr-1.5" />}
          {t('compare')}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: propertyTitle,
                url: window.location.href,
              })
            } else {
              navigator.clipboard.writeText(window.location.href)
              toast.success(t('linkCopied') || 'Link copied to clipboard')
            }
          }}
          className="h-9 w-9 text-gray-500 hover:text-gray-700"
          title={t('share') || 'Share'}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrint}
          className="h-9 w-9 text-gray-500 hover:text-gray-700"
          title={t('print') || 'Print'}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrint}
          className="h-9 w-9 text-gray-500 hover:text-gray-700"
          title={t('print') || 'Print'}
        >
          <Printer className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-500 hover:text-gray-700"
          title={t('notes') || 'Notes'}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReport}
          className="text-sm text-gray-500 hover:text-red-600 ml-auto"
        >
          <Flag className="h-4 w-4 mr-1.5" />
          {t('report')}
        </Button>
      </>
    )
  }

  // Default variant - original layout
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <FavoriteButton propertyId={propertyId} />
        <ShareProperty
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          propertyPrice={propertyPrice}
          propertyCity={propertyCity}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMapClick}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          <Map className="h-3.5 w-3.5 mr-1" />
          {t('onMap')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCompareClick}
          className={`text-xs ${inComparison ? 'text-blue-600' : 'text-gray-500'}`}
        >
          {inComparison ? <Check className="h-3.5 w-3.5 mr-1" /> : <GitCompare className="h-3.5 w-3.5 mr-1" />}
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
