import { NextRequest, NextResponse } from 'next/server'
import { searchProperties } from '@/lib/db'

// GET /api/properties/search - Search and filter properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const query = searchParams.get('query') || undefined
    const propertyType = searchParams.get('propertyType') || undefined
    const listingType = searchParams.get('listingType') || undefined
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
    const minBedrooms = searchParams.get('minBedrooms') ? Number(searchParams.get('minBedrooms')) : undefined
    const maxBedrooms = searchParams.get('maxBedrooms') ? Number(searchParams.get('maxBedrooms')) : undefined
    const minBathrooms = searchParams.get('minBathrooms') ? Number(searchParams.get('minBathrooms')) : undefined
    const maxBathrooms = searchParams.get('maxBathrooms') ? Number(searchParams.get('maxBathrooms')) : undefined
    const minArea = searchParams.get('minArea') ? Number(searchParams.get('minArea')) : undefined
    const maxArea = searchParams.get('maxArea') ? Number(searchParams.get('maxArea')) : undefined
    const city = searchParams.get('city') || undefined
    const state = searchParams.get('state') || undefined

    // Parse multiple property types (comma-separated)
    const propertyTypesParam = searchParams.get('propertyTypes')
    const propertyTypes = propertyTypesParam ? propertyTypesParam.split(',').map(t => t.trim()) : undefined

    // Parse multiple listing types (comma-separated)
    const listingTypesParam = searchParams.get('listingTypes')
    const listingTypes = listingTypesParam ? listingTypesParam.split(',').map(t => t.trim()) : undefined

    // Parse amenities (comma-separated)
    const amenitiesParam = searchParams.get('amenities')
    const amenities = amenitiesParam ? amenitiesParam.split(',').map(a => a.trim()) : undefined

    // Geolocation filters
    const latitude = searchParams.get('latitude') ? Number(searchParams.get('latitude')) : undefined
    const longitude = searchParams.get('longitude') ? Number(searchParams.get('longitude')) : undefined
    const radius = searchParams.get('radius') ? Number(searchParams.get('radius')) : undefined

    // Enhanced CIAN-style filters
    const buildingClassesParam = searchParams.get('buildingClasses')
    const buildingClasses = buildingClassesParam ? buildingClassesParam.split(',').map(c => c.trim()) : undefined

    const renovationTypesParam = searchParams.get('renovationTypes')
    const renovationTypes = renovationTypesParam ? renovationTypesParam.split(',').map(r => r.trim()) : undefined

    const parkingTypesParam = searchParams.get('parkingTypes')
    const parkingTypes = parkingTypesParam ? parkingTypesParam.split(',').map(p => p.trim()) : undefined

    const maxMetroDistance = searchParams.get('maxMetroDistance') ? Number(searchParams.get('maxMetroDistance')) : undefined
    const minPricePerSqFt = searchParams.get('minPricePerSqFt') ? Number(searchParams.get('minPricePerSqFt')) : undefined
    const maxPricePerSqFt = searchParams.get('maxPricePerSqFt') ? Number(searchParams.get('maxPricePerSqFt')) : undefined
    const minYearBuilt = searchParams.get('minYearBuilt') ? Number(searchParams.get('minYearBuilt')) : undefined
    const maxYearBuilt = searchParams.get('maxYearBuilt') ? Number(searchParams.get('maxYearBuilt')) : undefined
    const minFloor = searchParams.get('minFloor') ? Number(searchParams.get('minFloor')) : undefined
    const maxFloor = searchParams.get('maxFloor') ? Number(searchParams.get('maxFloor')) : undefined
    const hasBalcony = searchParams.get('hasBalcony') === 'true' ? true : undefined
    const hasConcierge = searchParams.get('hasConcierge') === 'true' ? true : undefined
    const hasGatedArea = searchParams.get('hasGatedArea') === 'true' ? true : undefined

    // Get sort parameter
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    // Build filters object
    const filters = {
      query,
      propertyType,
      listingType,
      propertyTypes,
      listingTypes,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      minArea,
      maxArea,
      city,
      state,
      amenities,
      latitude,
      longitude,
      radius,
      // Enhanced CIAN-style filters
      buildingClasses,
      renovationTypes,
      parkingTypes,
      maxMetroDistance,
      minPricePerSqFt,
      maxPricePerSqFt,
      minYearBuilt,
      maxYearBuilt,
      minFloor,
      maxFloor,
      hasBalcony,
      hasConcierge,
      hasGatedArea,
    }

    // Search properties
    let properties = await searchProperties(filters)

    // Apply sorting
    properties = properties.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sort) {
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'area':
          aValue = a.area || 0
          bValue = b.area || 0
          break
        case 'bedrooms':
          aValue = a.bedrooms || 0
          bValue = b.bedrooms || 0
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }

      if (order === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    // Pagination
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
    const limit = Math.min(searchParams.get('limit') ? Number(searchParams.get('limit')) : 10, 100)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const paginatedProperties = properties.slice(startIndex, endIndex)

    // Return results with metadata
    return NextResponse.json({
      properties: paginatedProperties,
      pagination: {
        page,
        limit,
        total: properties.length,
        totalPages: Math.ceil(properties.length / limit),
        hasMore: endIndex < properties.length,
      },
      filters: filters,
    })
  } catch (error) {
    console.error('Error searching properties:', error)
    return NextResponse.json(
      { error: 'Failed to search properties' },
      { status: 500 }
    )
  }
}
