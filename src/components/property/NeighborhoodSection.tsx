"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Landmark,
  Train,
  GraduationCap,
  Heart,
  ShoppingBag,
  UtensilsCrossed,
  TreePine,
  Building2,
  Loader2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Bus,
  School,
  Baby,
  Stethoscope,
  Pill,
  Store,
  Building,
  Coffee,
  Pizza,
  ParkingCircle,
  Dumbbell,
  Waves,
  Banknote,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import type { NeighborhoodData, NearbyPlace, PlaceCategory } from '@/lib/overpass'

interface NeighborhoodSectionProps {
  latitude: number | null
  longitude: number | null
  district?: string | null
  city?: string
}

// Icons for subcategories
const subcategoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  metro: Train,
  train: Train,
  bus: Bus,
  school: School,
  kindergarten: Baby,
  university: GraduationCap,
  college: GraduationCap,
  hospital: Heart,
  clinic: Stethoscope,
  pharmacy: Pill,
  doctors: Stethoscope,
  dentist: Stethoscope,
  supermarket: ShoppingBag,
  mall: Building,
  convenience: Store,
  market: Store,
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  fast_food: Pizza,
  park: TreePine,
  playground: Baby,
  gym: Dumbbell,
  sports: Dumbbell,
  pool: Waves,
  bank: Building2,
  atm: CreditCard,
}

// Category colors
const categoryColors: Record<PlaceCategory, { bg: string; text: string; icon: string }> = {
  transport: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600' },
  education: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600' },
  healthcare: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600' },
  shopping: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600' },
  food: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600' },
  leisure: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-600' },
  finance: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'text-yellow-600' },
}

// Category icons
const categoryIcons: Record<PlaceCategory, React.ComponentType<{ className?: string }>> = {
  transport: Train,
  education: GraduationCap,
  healthcare: Heart,
  shopping: ShoppingBag,
  food: UtensilsCrossed,
  leisure: TreePine,
  finance: Banknote,
}

export function NeighborhoodSection({
  latitude,
  longitude,
  district,
  city,
}: NeighborhoodSectionProps) {
  const t = useTranslations('properties.details.neighborhood')
  const [data, setData] = useState<NeighborhoodData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<PlaceCategory>>(new Set())

  useEffect(() => {
    if (latitude && longitude) {
      fetchData()
    }
  }, [latitude, longitude])

  const fetchData = async () => {
    if (!latitude || !longitude) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/neighborhood/${latitude}/${longitude}?radius=1500`)
      if (!res.ok) throw new Error('Failed to fetch')

      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error('Failed to fetch neighborhood data:', err)
      setError(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return t('distance.meters', { distance: meters })
    }
    return t('distance.kilometers', { distance: (meters / 1000).toFixed(1) })
  }

  const formatWalkTime = (meters: number): string => {
    const minutes = Math.round(meters / 83) // ~5 km/h walking speed
    return t('distance.walkMinutes', { minutes })
  }

  const getWalkScoreLabel = (score: number): { label: string; color: string } => {
    if (score >= 90) return { label: t('walkScoreLabels.excellent'), color: 'text-green-600' }
    if (score >= 70) return { label: t('walkScoreLabels.veryGood'), color: 'text-green-500' }
    if (score >= 50) return { label: t('walkScoreLabels.good'), color: 'text-yellow-600' }
    if (score >= 25) return { label: t('walkScoreLabels.carDependent'), color: 'text-orange-500' }
    return { label: t('walkScoreLabels.carRequired'), color: 'text-red-500' }
  }

  const toggleCategory = (category: PlaceCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const renderPlaceItem = (place: NearbyPlace) => {
    const Icon = subcategoryIcons[place.subcategory] || MapPin

    return (
      <div key={place.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate">{place.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-xs text-gray-500">{formatDistance(place.distance)}</span>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {formatWalkTime(place.distance)}
          </Badge>
        </div>
      </div>
    )
  }

  const renderCategory = (category: PlaceCategory, places: NearbyPlace[]) => {
    if (places.length === 0) return null

    const colors = categoryColors[category]
    const Icon = categoryIcons[category]
    const isExpanded = expandedCategories.has(category)
    const displayPlaces = isExpanded ? places : places.slice(0, 3)
    const hasMore = places.length > 3

    return (
      <div key={category} className={`rounded-lg ${colors.bg} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${colors.icon}`} />
            <h4 className={`font-medium ${colors.text}`}>
              {t(`categories.${category}`)}
            </h4>
            <Badge variant="secondary" className="text-xs">
              {places.length}
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          {displayPlaces.map(renderPlaceItem)}
        </div>

        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-xs"
            onClick={() => toggleCategory(category)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                {t('showAll')} ({places.length - 3} ...)
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                {t('showAll')} (+{places.length - 3})
              </>
            )}
          </Button>
        )}
      </div>
    )
  }

  // No coordinates available
  if (!latitude || !longitude) {
    return null
  }

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin mb-3" />
          <p className="text-sm">{t('loading')}</p>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="py-8 flex flex-col items-center justify-center text-gray-500">
          <AlertCircle className="h-8 w-8 mb-3 text-red-400" />
          <p className="text-sm">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchData}>
            Повторить
          </Button>
        </CardContent>
      </Card>
    )
  }

  // No data yet
  if (!data) {
    return null
  }

  const { walkScore, summary } = data
  const walkScoreInfo = getWalkScoreLabel(walkScore)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-blue-600" />
            {t('title')}
            {district && <span className="text-gray-500 font-normal">— {district}</span>}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Walk Score & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Walk Score */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{t('walkScore')}</span>
              <span className={`text-3xl font-bold ${walkScoreInfo.color}`}>{walkScore}</span>
            </div>
            <p className={`text-sm ${walkScoreInfo.color}`}>{walkScoreInfo.label}</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  walkScore >= 70 ? 'bg-green-500' :
                  walkScore >= 50 ? 'bg-yellow-500' :
                  walkScore >= 25 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${walkScore}%` }}
              />
            </div>
          </div>

          {/* Quick Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-sm font-medium text-gray-600 mb-3 block">
              {t('summary.placesFound', { count: summary.totalPlaces })}
            </span>
            <div className="flex flex-wrap gap-2">
              {summary.hasGoodTransport && (
                <Badge variant="outline" className="bg-white">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  {t('summary.goodTransport')}
                </Badge>
              )}
              {summary.hasSchoolsNearby && (
                <Badge variant="outline" className="bg-white">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  {t('summary.schoolsNearby')}
                </Badge>
              )}
              {summary.hasHealthcareNearby && (
                <Badge variant="outline" className="bg-white">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  {t('summary.healthcareNearby')}
                </Badge>
              )}
              {summary.hasShoppingNearby && (
                <Badge variant="outline" className="bg-white">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  {t('summary.shoppingNearby')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Key Places */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {summary.nearestMetro && (
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Train className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-purple-700 truncate">{summary.nearestMetro.name}</div>
              <div className="text-xs text-purple-600">{formatWalkTime(summary.nearestMetro.distance)}</div>
            </div>
          )}
          {summary.nearestSchool && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <School className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-blue-700 truncate">{summary.nearestSchool.name}</div>
              <div className="text-xs text-blue-600">{formatDistance(summary.nearestSchool.distance)}</div>
            </div>
          )}
          {summary.nearestHospital && (
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <Heart className="h-6 w-6 text-red-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-red-700 truncate">{summary.nearestHospital.name}</div>
              <div className="text-xs text-red-600">{formatDistance(summary.nearestHospital.distance)}</div>
            </div>
          )}
          {summary.nearestSupermarket && (
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-green-700 truncate">{summary.nearestSupermarket.name}</div>
              <div className="text-xs text-green-600">{formatDistance(summary.nearestSupermarket.distance)}</div>
            </div>
          )}
          {summary.nearestPark && (
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <TreePine className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-emerald-700 truncate">{summary.nearestPark.name}</div>
              <div className="text-xs text-emerald-600">{formatDistance(summary.nearestPark.distance)}</div>
            </div>
          )}
        </div>

        {/* Detailed Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderCategory('transport', data.transport)}
          {renderCategory('education', data.education)}
          {renderCategory('healthcare', data.healthcare)}
          {renderCategory('shopping', data.shopping)}
          {renderCategory('food', data.food)}
          {renderCategory('leisure', data.leisure)}
        </div>

        {/* Area Description */}
        {district && city && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              {t('areaDescription', { district, city })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
