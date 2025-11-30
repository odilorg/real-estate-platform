import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all unique cities with property counts
    const properties = await prisma.property.findMany({
      where: { status: 'ACTIVE' },
      select: {
        city: true,
        district: true,
        price: true,
      },
    })

    // Aggregate by city
    const cityStats: Record<string, {
      count: number
      minPrice: number
      maxPrice: number
      avgPrice: number
      districts: Set<string>
    }> = {}

    properties.forEach((prop) => {
      if (!cityStats[prop.city]) {
        cityStats[prop.city] = {
          count: 0,
          minPrice: Infinity,
          maxPrice: 0,
          avgPrice: 0,
          districts: new Set(),
        }
      }
      cityStats[prop.city].count++
      cityStats[prop.city].minPrice = Math.min(cityStats[prop.city].minPrice, prop.price)
      cityStats[prop.city].maxPrice = Math.max(cityStats[prop.city].maxPrice, prop.price)
      cityStats[prop.city].avgPrice += prop.price
      if (prop.district) {
        cityStats[prop.city].districts.add(prop.district)
      }
    })

    // Convert to array with calculated averages
    const areas = Object.entries(cityStats)
      .map(([city, stats]) => ({
        city,
        count: stats.count,
        minPrice: stats.minPrice === Infinity ? 0 : stats.minPrice,
        maxPrice: stats.maxPrice,
        avgPrice: Math.round(stats.avgPrice / stats.count),
        districtCount: stats.districts.size,
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({ areas })
  } catch (error) {
    console.error('Error fetching areas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch areas' },
      { status: 500 }
    )
  }
}
