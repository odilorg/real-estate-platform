"use client"

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, X, Loader2, Search } from 'lucide-react'

interface LocationResult {
  display_name: string
  lat: string
  lon: string
  address?: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

interface LocationSearchProps {
  onLocationSelect: (location: {
    name: string
    lat: number
    lon: number
    city?: string
    state?: string
  }) => void
  selectedLocations: Array<{
    name: string
    lat: number
    lon: number
  }>
  onRemoveLocation: (index: number) => void
  placeholder?: string
}

export function LocationSearch({
  onLocationSelect,
  selectedLocations,
  onRemoveLocation,
  placeholder,
}: LocationSearchProps) {
  const t = useTranslations('properties')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        // Using Nominatim (OpenStreetMap) for free geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          }
        )
        const data = await response.json()
        setResults(data)
        setShowDropdown(true)
      } catch (error) {
        console.error('Geocoding error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (result: LocationResult) => {
    const city = result.address?.city || result.address?.town || result.address?.village
    const state = result.address?.state

    onLocationSelect({
      name: city || result.display_name.split(',')[0],
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      city,
      state,
    })

    setQuery('')
    setResults([])
    setShowDropdown(false)
  }

  const formatDisplayName = (result: LocationResult) => {
    const parts = result.display_name.split(',').slice(0, 3)
    return parts.join(', ')
  }

  return (
    <div className="space-y-2">
      {/* Selected location tags */}
      {selectedLocations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLocations.map((location, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>{location.name}</span>
              <button
                onClick={() => onRemoveLocation(index)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder || t('filters.searchLocation')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            className="pl-9 pr-10"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
          {!loading && query && (
            <button
              onClick={() => {
                setQuery('')
                setResults([])
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Results dropdown */}
        {showDropdown && results.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3 border-b last:border-b-0"
              >
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {result.address?.city || result.address?.town || result.address?.village || result.display_name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDisplayName(result)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {showDropdown && query.length >= 2 && !loading && results.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg p-4 text-center">
            <p className="text-sm text-gray-500">No locations found</p>
          </div>
        )}
      </div>
    </div>
  )
}
