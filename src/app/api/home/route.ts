import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get featured properties (most recent active listings)
    const featuredProperties = await prisma.property.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    })

    // Get recent properties (newest 4)
    const recentProperties = await prisma.property.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    })

    // Get popular areas (cities with most properties)
    const cityStats = await prisma.property.groupBy({
      by: ['city'],
      where: {
        status: 'ACTIVE',
      },
      _count: {
        id: true,
      },
      _avg: {
        price: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 6,
    })

    const popularAreas = cityStats.map((stat) => ({
      city: stat.city,
      count: stat._count.id,
      avgPrice: Math.round(stat._avg.price || 0),
    }))

    // Get platform stats
    const [totalProperties, totalAgents, totalUsers] = await Promise.all([
      prisma.property.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.agent.count(),
      prisma.userProfile.count(),
    ])

    // Get unique cities count
    const citiesResult = await prisma.property.findMany({
      where: { status: 'ACTIVE' },
      select: { city: true },
      distinct: ['city'],
    })
    const citiesCovered = citiesResult.length

    // Format properties for response
    const formatProperties = (properties: typeof featuredProperties) =>
      properties.map((prop) => ({
        id: prop.id,
        title: prop.title,
        price: prop.price,
        listingType: prop.listingType,
        propertyType: prop.propertyType,
        address: prop.address,
        city: prop.city,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        area: prop.area,
        images: prop.images.map((img) => img.url),
        createdAt: prop.createdAt.toISOString(),
      }))

    return NextResponse.json({
      featured: formatProperties(featuredProperties),
      recent: formatProperties(recentProperties),
      popularAreas,
      stats: {
        totalProperties,
        totalAgents,
        totalUsers,
        citiesCovered,
      },
    })
  } catch (error) {
    console.error('Error fetching home data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    )
  }
}
