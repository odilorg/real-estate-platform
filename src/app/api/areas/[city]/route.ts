import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await params
    const decodedCity = decodeURIComponent(city)

    // Get all properties in this city
    const properties = await prisma.property.findMany({
      where: {
        city: decodedCity,
        status: 'ACTIVE',
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate city stats
    const totalProperties = properties.length
    const forSale = properties.filter((p) => p.listingType === 'SALE').length
    const forRent = properties.filter((p) => p.listingType === 'RENT').length
    const avgPrice = totalProperties > 0
      ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / totalProperties)
      : 0
    const minPrice = totalProperties > 0
      ? Math.min(...properties.map((p) => p.price))
      : 0
    const maxPrice = totalProperties > 0
      ? Math.max(...properties.map((p) => p.price))
      : 0

    // Get district breakdown
    const districtStats: Record<string, { count: number; avgPrice: number }> = {}
    properties.forEach((prop) => {
      const district = prop.district || 'Other'
      if (!districtStats[district]) {
        districtStats[district] = { count: 0, avgPrice: 0 }
      }
      districtStats[district].count++
      districtStats[district].avgPrice += prop.price
    })

    const districts = Object.entries(districtStats)
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        avgPrice: Math.round(stats.avgPrice / stats.count),
      }))
      .sort((a, b) => b.count - a.count)

    // Property type breakdown
    const propertyTypes: Record<string, number> = {}
    properties.forEach((prop) => {
      propertyTypes[prop.propertyType] = (propertyTypes[prop.propertyType] || 0) + 1
    })

    // Format properties for response
    const formattedProperties = properties.map((prop) => ({
      id: prop.id,
      title: prop.title,
      price: prop.price,
      listingType: prop.listingType,
      propertyType: prop.propertyType,
      address: prop.address,
      city: prop.city,
      state: prop.state,
      district: prop.district,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      area: prop.area,
      images: prop.images.map((img) => img.url),
    }))

    return NextResponse.json({
      city: decodedCity,
      stats: {
        totalProperties,
        forSale,
        forRent,
        avgPrice,
        minPrice,
        maxPrice,
      },
      districts,
      propertyTypes,
      properties: formattedProperties,
    })
  } catch (error) {
    console.error('Error fetching area data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch area data' },
      { status: 500 }
    )
  }
}
