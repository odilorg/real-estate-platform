"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  MapPin,
  Search,
  Navigation,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
})

interface LocationPickerProps {
  latitude?: number | null
  longitude?: number | null
  onLocationChange: (lat: number, lng: number) => void
  defaultCenter?: { lat: number; lng: number }
}

interface SearchResult {
  display_name: string
  lat: string
  lon: string
  type: string
  address?: {
    road?: string
    house_number?: string
    city?: string
    state?: string
    country?: string
  }
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  defaultCenter = { lat: 41.2995, lng: 69.2401 }, // Tashkent
}: LocationPickerProps) {
  const t = useTranslations('properties.form.locationPicker')
  const tCommon = useTranslations('common')

  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  const [error, setError] = useState<string | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Current position for the map
  const currentPosition = latitude && longitude
    ? { lat: latitude, lng: longitude }
    : null

  // Search for address using OpenStreetMap Nominatim
  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      // Add Uzbekistan bias to search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=5&` +
        `countrycodes=uz&` +
        `accept-language=ru,uz`
      )

      if (!response.ok) throw new Error('Search failed')

      const data: SearchResult[] = await response.json()
      setSearchResults(data)
    } catch (err) {
      console.error('Address search error:', err)
      setError(t('searchError'))
    } finally {
      setIsSearching(false)
    }
  }, [t])

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        searchAddress(searchQuery)
      }, 500)
    } else {
      setSearchResults([])
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, searchAddress])

  // Handle search result selection
  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    onLocationChange(lat, lng)
    setSearchQuery('')
    setSearchResults([])
  }

  // Get current location using browser geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t('geolocationNotSupported'))
      return
    }

    setIsLocating(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange(position.coords.latitude, position.coords.longitude)
        setIsLocating(false)
      },
      (err) => {
        console.error('Geolocation error:', err)
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(t('geolocationDenied'))
            break
          case err.POSITION_UNAVAILABLE:
            setError(t('geolocationUnavailable'))
            break
          case err.TIMEOUT:
            setError(t('geolocationTimeout'))
            break
          default:
            setError(t('geolocationError'))
        }
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  // Handle manual coordinate input
  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng)) {
      setError(t('invalidCoordinates'))
      return
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError(t('coordinatesOutOfRange'))
      return
    }

    onLocationChange(lat, lng)
    setShowManualInput(false)
    setManualLat('')
    setManualLng('')
    setError(null)
  }

  // Handle map click
  const handleMapClick = (lat: number, lng: number) => {
    onLocationChange(lat, lng)
  }

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
      <CardContent className="p-4">
        {/* Header with expand toggle */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <MapPin className={`h-5 w-5 ${currentPosition ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <Label className="font-medium cursor-pointer">
                {t('title')}
              </Label>
              {currentPosition ? (
                <p className="text-sm text-green-600">
                  {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-gray-500">{t('clickToSet')}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Search input */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>

              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-start gap-2"
                      onClick={() => handleSelectResult(result)}
                    >
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{result.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="flex-1"
              >
                {isLocating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4 mr-2" />
                )}
                {t('useMyLocation')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowManualInput(!showManualInput)}
              >
                {showManualInput ? t('hideManual') : t('enterManually')}
              </Button>
            </div>

            {/* Manual input */}
            {showManualInput && (
              <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">{t('latitude')}</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="41.2995"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t('longitude')}</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="69.2401"
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleManualSubmit}
                  className="w-full"
                >
                  {t('setCoordinates')}
                </Button>
              </div>
            )}

            {/* Interactive Map */}
            <div className="rounded-lg overflow-hidden border">
              <MapComponent
                position={currentPosition}
                defaultCenter={defaultCenter}
                onMapClick={handleMapClick}
              />
            </div>

            {/* Help text */}
            <p className="text-xs text-gray-500 text-center">
              {t('helpText')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
