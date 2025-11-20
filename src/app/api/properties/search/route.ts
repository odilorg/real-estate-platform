import { NextRequest, NextResponse } from 'next/server'
import { getDataStore } from '@/lib/dataStore'

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
    const bedrooms = searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined
    const bathrooms = searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined
    const city = searchParams.get('city') || undefined

    // Parse amenities (comma-separated)
    const amenitiesParam = searchParams.get('amenities')
    const amenities = amenitiesParam ? amenitiesParam.split(',').map(a => a.trim()) : undefined

    // Get sort parameter
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    // Build filters object
    const filters = {
      query,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      amenities,
    }

    // Search properties
    const dataStore = getDataStore()
    let properties = dataStore.searchProperties(filters)

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
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10
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
