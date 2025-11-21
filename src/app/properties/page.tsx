"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { MapView } from '@/components/map/MapView'
import { AdvancedFilters, AdvancedFilterValues } from '@/components/search/AdvancedFilters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, SlidersHorizontal, Loader2, Map as MapIcon, List } from 'lucide-react'

interface Property {
  id: string
  title: string
  description: string
  price: number
  propertyType: string
  listingType: string
  address: string
  city: string
  state?: string
  zipCode?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  yearBuilt?: number
  floor?: number
  totalFloors?: number
  images: string[]
  amenities: string[]
  latitude?: number
  longitude?: number
  createdAt: Date
}

interface SearchResponse {
  properties: Property[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  filters: any
}

export default function PropertiesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Filter states
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'all')
  const [listingType, setListingType] = useState(searchParams.get('listingType') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterValues>({
    propertyTypes: [],
    listingTypes: [],
    amenities: [],
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
  }, [debouncedQuery, propertyType, listingType, sortBy, page, router])

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
  }

  const hasActiveFilters = query || propertyType !== 'all' || listingType !== 'all'

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold mb-4">Browse Properties</h1>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by location, property type, or keyword..."
                  className="pl-10"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                />
              </div>

              <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="APARTMENT">Apartment</SelectItem>
                  <SelectItem value="HOUSE">House</SelectItem>
                  <SelectItem value="CONDO">Condo</SelectItem>
                  <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                  <SelectItem value="VILLA">Villa</SelectItem>
                  <SelectItem value="STUDIO">Studio</SelectItem>
                  <SelectItem value="LAND">Land</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                </SelectContent>
              </Select>

              <Select value={listingType} onValueChange={handleListingTypeChange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Listing Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">For Sale & Rent</SelectItem>
                  <SelectItem value="SALE">For Sale</SelectItem>
                  <SelectItem value="RENT">For Rent</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters} className="w-full md:w-auto">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                })
                setPage(1)
              }}
            />
          </div>

          {/* Results Count, View Toggle and Sort */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {loading ? (
                'Searching...'
              ) : (
                <>
                  <span className="font-semibold text-gray-900">{pagination.total}</span>{' '}
                  {pagination.total === 1 ? 'property' : 'properties'} found
                </>
              )}
            </p>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-none"
                >
                  <MapIcon className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Newest First</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="area">Area: Largest First</SelectItem>
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

          {/* Map View */}
          {!loading && !error && properties.length > 0 && viewMode === 'map' && (
            <div className="mb-6">
              <MapView
                properties={properties}
                height="600px"
                onMarkerClick={(property) => router.push(`/properties/${property.id}`)}
              />
            </div>
          )}

          {/* Property Cards */}
          {!loading && !error && properties.length > 0 && viewMode === 'list' && (
            <>
              <div className="space-y-4">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          onClick={() => setPage(pageNum)}
                          className="w-10 h-10"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                  >
                    Next
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
