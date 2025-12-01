import { NextRequest, NextResponse } from 'next/server'
import { fetchNeighborhoodData } from '@/lib/overpass'
import { prisma } from '@/lib/prisma'

// Cache neighborhood data for 7 days
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000

interface CachedData {
  data: Awaited<ReturnType<typeof fetchNeighborhoodData>>
  timestamp: number
}

// In-memory cache (for development; in production use Redis)
const memoryCache = new Map<string, CachedData>()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lat: string; lng: string }> }
) {
  try {
    const { lat: latStr, lng: lngStr } = await params
    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      )
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Coordinates out of range' },
        { status: 400 }
      )
    }

    // Get radius from query params (default 1500m)
    const { searchParams } = new URL(request.url)
    const radius = Math.min(
      parseInt(searchParams.get('radius') || '1500', 10),
      3000 // Max 3km to avoid overloading API
    )

    // Round coordinates to 4 decimal places for caching (about 11m precision)
    const roundedLat = Math.round(lat * 10000) / 10000
    const roundedLng = Math.round(lng * 10000) / 10000
    const cacheKey = `${roundedLat},${roundedLng},${radius}`

    // Check memory cache first
    const cached = memoryCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
        cacheAge: Math.round((Date.now() - cached.timestamp) / 1000 / 60), // minutes
      })
    }

    // Fetch fresh data from Overpass API
    const data = await fetchNeighborhoodData(roundedLat, roundedLng, radius)

    // Cache the result
    memoryCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    })

    // Clean old cache entries (keep only last 100)
    if (memoryCache.size > 100) {
      const entries = Array.from(memoryCache.entries())
      entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, memoryCache.size - 100)
        .forEach(([key]) => memoryCache.delete(key))
    }

    return NextResponse.json({
      ...data,
      cached: false,
    })
  } catch (error) {
    console.error('Neighborhood API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch neighborhood data' },
      { status: 500 }
    )
  }
}
