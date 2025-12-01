"use client"

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MainLayout } from '@/components/layout'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { MapView } from '@/components/map/MapView'
import { AdvancedFilters, AdvancedFilterValues } from '@/components/search/AdvancedFilters'
import { SaveSearchDialog } from '@/components/search/SaveSearchDialog'
import { LocationSearch } from '@/components/search/LocationSearch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, SlidersHorizontal, Loader2, Map as MapIcon, List, LayoutGrid, Columns } from 'lucide-react'
import type { Property, SearchResponse } from '@/types'

// Custom hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

interface SelectedLocation {
  name: string
  lat: number
  lon: number
  city?: string
  state?: string
}

function PropertiesLoading() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading properties...</span>
      </div>
    </MainLayout>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<PropertiesLoading />}>
      <PropertiesContent />
    </Suspense>
  )
}

function PropertiesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('properties')
  const isMobile = useIsMobile()

  // Filter states
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'all')
  const [listingType, setListingType] = useState(searchParams.get('listingType') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('list')

  // Auto-switch to list view on mobile
  useEffect(() => {
    if (isMobile && viewMode === 'split') {
      setViewMode('list')
    }
  }, [isMobile, viewMode])
  const [selectedLocations, setSelectedLocations] = useState<SelectedLocation[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.006])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>()
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterValues>({
    propertyTypes: [],
    listingTypes: [],
    amenities: [],
    buildingClasses: [],
    renovationTypes: [],
    parkingTypes: [],
  })

  // Data states
  const [properties, setProperties] = useState<Property[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  // Fetch properties when filters change
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)

      try {
        // Build query params
        const params = new URLSearchParams()
        if (debouncedQuery) params.append('query', debouncedQuery)
        if (propertyType !== 'all') params.append('propertyType', propertyType)
        if (listingType !== 'all') params.append('listingType', listingType)
        params.append('sort', sortBy)
        params.append('order', sortBy === 'createdAt' ? 'desc' : 'asc')
        params.append('page', page.toString())
        params.append('limit', '10')

        // Add advanced filters
        if (advancedFilters.propertyTypes.length > 0) {
          params.append('propertyTypes', advancedFilters.propertyTypes.join(','))
        }
        if (advancedFilters.listingTypes.length > 0) {
          params.append('listingTypes', advancedFilters.listingTypes.join(','))
        }
        if (advancedFilters.minPrice !== undefined) {
          params.append('minPrice', advancedFilters.minPrice.toString())
        }
        if (advancedFilters.maxPrice !== undefined) {
          params.append('maxPrice', advancedFilters.maxPrice.toString())
        }
        if (advancedFilters.minBedrooms !== undefined) {
          params.append('minBedrooms', advancedFilters.minBedrooms.toString())
        }
        if (advancedFilters.maxBedrooms !== undefined) {
          params.append('maxBedrooms', advancedFilters.maxBedrooms.toString())
        }
        if (advancedFilters.minBathrooms !== undefined) {
          params.append('minBathrooms', advancedFilters.minBathrooms.toString())
        }
        if (advancedFilters.maxBathrooms !== undefined) {
          params.append('maxBathrooms', advancedFilters.maxBathrooms.toString())
        }
        if (advancedFilters.minArea !== undefined) {
          params.append('minArea', advancedFilters.minArea.toString())
        }
        if (advancedFilters.maxArea !== undefined) {
          params.append('maxArea', advancedFilters.maxArea.toString())
        }
        if (advancedFilters.amenities.length > 0) {
          params.append('amenities', advancedFilters.amenities.join(','))
        }
        if (advancedFilters.city) {
          params.append('city', advancedFilters.city)
        }
        if (advancedFilters.state) {
          params.append('state', advancedFilters.state)
        }
        if (advancedFilters.latitude !== undefined) {
          params.append('latitude', advancedFilters.latitude.toString())
        }
        if (advancedFilters.longitude !== undefined) {
          params.append('longitude', advancedFilters.longitude.toString())
        }
        if (advancedFilters.radius !== undefined) {
          params.append('radius', advancedFilters.radius.toString())
        }
        // Enhanced CIAN-style filters
        if (advancedFilters.buildingClasses && advancedFilters.buildingClasses.length > 0) {
          params.append('buildingClasses', advancedFilters.buildingClasses.join(','))
        }
        if (advancedFilters.renovationTypes && advancedFilters.renovationTypes.length > 0) {
          params.append('renovationTypes', advancedFilters.renovationTypes.join(','))
        }
        if (advancedFilters.maxMetroDistance !== undefined) {
          params.append('maxMetroDistance', advancedFilters.maxMetroDistance.toString())
        }
        if (advancedFilters.minPricePerSqFt !== undefined) {
          params.append('minPricePerSqFt', advancedFilters.minPricePerSqFt.toString())
        }
        if (advancedFilters.maxPricePerSqFt !== undefined) {
          params.append('maxPricePerSqFt', advancedFilters.maxPricePerSqFt.toString())
        }
        if (advancedFilters.minYearBuilt !== undefined) {
          params.append('minYearBuilt', advancedFilters.minYearBuilt.toString())
        }
        if (advancedFilters.maxYearBuilt !== undefined) {
          params.append('maxYearBuilt', advancedFilters.maxYearBuilt.toString())
        }
        if (advancedFilters.minFloor !== undefined) {
          params.append('minFloor', advancedFilters.minFloor.toString())
        }
        if (advancedFilters.maxFloor !== undefined) {
          params.append('maxFloor', advancedFilters.maxFloor.toString())
        }
        if (advancedFilters.parkingTypes && advancedFilters.parkingTypes.length > 0) {
          params.append('parkingTypes', advancedFilters.parkingTypes.join(','))
        }
        if (advancedFilters.hasBalcony !== undefined) {
          params.append('hasBalcony', advancedFilters.hasBalcony.toString())
        }
        if (advancedFilters.hasConcierge !== undefined) {
          params.append('hasConcierge', advancedFilters.hasConcierge.toString())
        }
        if (advancedFilters.hasGatedArea !== undefined) {
          params.append('hasGatedArea', advancedFilters.hasGatedArea.toString())
        }

        // Update URL
        const newUrl = `/properties?${params.toString()}`
        router.push(newUrl, { scroll: false })

        // Fetch data
        const response = await fetch(`/api/properties/search?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch properties')

        const data: SearchResponse = await response.json()
        setProperties(data.properties)
        setPagination(data.pagination)
      } catch (err) {
        setError('Failed to load properties. Please try again.')
        console.error('Error fetching properties:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [debouncedQuery, propertyType, listingType, sortBy, page, router, advancedFilters])

  // Handle filter changes
  const handleQueryChange = (value: string) => {
    setQuery(value)
    setPage(1) // Reset to first page
  }

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value)
    setPage(1)
  }

  const handleListingTypeChange = (value: string) => {
    setListingType(value)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPage(1)
  }

  const handleClearFilters = () => {
    setQuery('')
    setPropertyType('all')
    setListingType('all')
    setSortBy('createdAt')
    setPage(1)
    setSelectedLocations([])
  }

  const handleLocationSelect = (location: SelectedLocation) => {
    setSelectedLocations(prev => [...prev, location])
    setMapCenter([location.lat, location.lon])
    setPage(1)
  }

  const handleRemoveLocation = (index: number) => {
    setSelectedLocations(prev => prev.filter((_, i) => i !== index))
    setPage(1)
  }

  const handlePropertyHover = (propertyId: string | undefined) => {
    setSelectedPropertyId(propertyId)
  }

  const hasActiveFilters = query || propertyType !== 'all' || listingType !== 'all' || selectedLocations.length > 0

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold">{t('title')}</h1>
              <div className="flex gap-2 items-center">
                <SaveSearchDialog
                  filters={{ query, propertyType, listingType, sortBy }}
                  advancedFilters={advancedFilters}
                />
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    {t('filters.resetFilters') || 'Clear Filters'}
                  </Button>
                )}
              </div>
            </div>

            {/* Location Search */}
            <div className="mb-4">
              <LocationSearch
                onLocationSelect={handleLocationSelect}
                selectedLocations={selectedLocations}
                onRemoveLocation={handleRemoveLocation}
              />
            </div>

            {/* Filters Row - Mobile Stacked, Desktop Inline */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 items-center">
              <Select value={listingType} onValueChange={handleListingTypeChange}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder={t('filters.listingType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('listingTypes.sale')} & {t('listingTypes.rent')}</SelectItem>
                  <SelectItem value="SALE">{t('listingTypes.sale')}</SelectItem>
                  <SelectItem value="RENT">{t('listingTypes.rent')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={t('filters.propertyType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="APARTMENT">{t('types.apartment')}</SelectItem>
                  <SelectItem value="HOUSE">{t('types.house')}</SelectItem>
                  <SelectItem value="CONDO">{t('types.condo')}</SelectItem>
                  <SelectItem value="TOWNHOUSE">{t('types.townhouse')}</SelectItem>
                  <SelectItem value="VILLA">Villa</SelectItem>
                  <SelectItem value="STUDIO">Studio</SelectItem>
                  <SelectItem value="LAND">{t('types.land')}</SelectItem>
                  <SelectItem value="COMMERCIAL">{t('types.commercial')}</SelectItem>
                </SelectContent>
              </Select>

              <div className="col-span-2 sm:col-span-1 sm:flex-1 relative sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  className="pl-9 h-9 w-full"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Advanced Filters */}
          <div className="mb-6">
            <AdvancedFilters
              values={advancedFilters}
              onChange={setAdvancedFilters}
              onApply={() => setPage(1)}
              onReset={() => {
                setAdvancedFilters({
                  propertyTypes: [],
                  listingTypes: [],
                  amenities: [],
                  buildingClasses: [],
                  renovationTypes: [],
                  parkingTypes: [],
                })
                setPage(1)
              }}
            />
          </div>

          {/* Results Count, View Toggle and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <p className="text-sm sm:text-base text-gray-600">
              {loading ? (
                'Searching...'
              ) : (
                <>
                  <span className="font-semibold text-gray-900">{pagination.total.toLocaleString()}</span>{' '}
                  {t('foundProperties')}
                </>
              )}
            </p>
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none px-2 sm:px-3"
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
                {/* Hide split view on mobile */}
                <Button
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('split')}
                  className="rounded-none px-2 sm:px-3 hidden md:flex"
                  title="Split view"
                >
                  <Columns className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-none px-2 sm:px-3"
                  title="Map view"
                >
                  <MapIcon className="h-4 w-4" />
                </Button>
              </div>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32 sm:w-44">
                  <SelectValue placeholder={t('sort.title')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">{t('sort.newest')}</SelectItem>
                  <SelectItem value="price">{t('sort.priceAsc')}</SelectItem>
                  <SelectItem value="area">{t('sort.areaDesc')}</SelectItem>
                  <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading properties...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          )}

          {/* Split View - Map + List side by side */}
          {!loading && !error && properties.length > 0 && viewMode === 'split' && (
            <div className="flex gap-4 h-[calc(100vh-280px)]">
              {/* Property List - Left Side */}
              <div className="w-1/2 overflow-y-auto pr-2 space-y-3">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    onMouseEnter={() => handlePropertyHover(property.id)}
                    onMouseLeave={() => handlePropertyHover(undefined)}
                  >
                    <PropertyCard property={property} compact />
                  </div>
                ))}
                {/* Pagination for split view */}
                {pagination.totalPages > 1 && (
                  <div className="py-4 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
              {/* Map - Right Side */}
              <div className="w-1/2 sticky top-0">
                <MapView
                  properties={properties}
                  height="100%"
                  center={mapCenter}
                  selectedPropertyId={selectedPropertyId}
                  onMarkerClick={(property) => router.push(`/properties/${property.id}`)}
                />
              </div>
            </div>
          )}

          {/* Full Map View */}
          {!loading && !error && properties.length > 0 && viewMode === 'map' && (
            <div className="h-[60vh] sm:h-[calc(100vh-280px)]">
              <MapView
                properties={properties}
                height="100%"
                center={mapCenter}
                selectedPropertyId={selectedPropertyId}
                onMarkerClick={(property) => router.push(`/properties/${property.id}`)}
              />
            </div>
          )}

          {/* List View */}
          {!loading && !error && properties.length > 0 && viewMode === 'list' && (
            <>
              <div className="space-y-4">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2 sm:px-4"
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">&lt;</span>
                  </Button>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {Array.from({ length: Math.min(isMobile ? 3 : 5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      const maxPages = isMobile ? 3 : 5
                      if (pagination.totalPages <= maxPages) {
                        pageNum = i + 1
                      } else if (page <= Math.ceil(maxPages / 2)) {
                        pageNum = i + 1
                      } else if (page >= pagination.totalPages - Math.floor(maxPages / 2)) {
                        pageNum = pagination.totalPages - maxPages + 1 + i
                      } else {
                        pageNum = page - Math.floor(maxPages / 2) + i
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-8 h-8 sm:w-10 sm:h-10 p-0"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-2 sm:px-4"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">&gt;</span>
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && properties.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters
                  ? 'Try adjusting your search criteria'
                  : 'No properties are currently listed'}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
