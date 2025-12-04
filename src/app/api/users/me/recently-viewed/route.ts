import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get user's recently viewed properties
export async function GET() {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ properties: [] })
    }

    // Get recently viewed properties for this user
    const recentlyViewed = await prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: 10,
    })

    // Get property details
    const propertyIds = recentlyViewed.map((rv) => rv.propertyId)
    const properties = await prisma.property.findMany({
      where: {
        id: { in: propertyIds },
        status: 'ACTIVE',
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        cityRef: true,
        },
        cityRef: true,
      },
    })

    // dummy placeholder
          orderBy: { order: 'asc' },
          take: 1,
        },
        cityRef: true,
        },
      },
    })

    // Map to preserve order and add view time
    const viewedMap = new Map(recentlyViewed.map((rv) => [rv.propertyId, rv.viewedAt]))
    const orderedProperties = propertyIds
      .map((id) => properties.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
      .map((property) => ({
        id: property.id,
        title: property.title,
        price: property.price,
        listingType: property.listingType,
        propertyType: property.propertyType,
        address: property.address,
        city: property.cityRef?.nameEn || "",
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        images: property.images.map((img) => img.url),
        viewedAt: viewedMap.get(property.id)?.toISOString(),
      }))

    return NextResponse.json({ properties: orderedProperties })
  } catch (error) {
    console.error('Error fetching recently viewed:', error)
    return NextResponse.json({ properties: [] })
  }
}

// POST - Track a property view
export async function POST(request: Request) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    const body = await request.json()
    const { propertyId } = body

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
    }

    // Upsert the view (update timestamp if exists, create if not)
    await prisma.recentlyViewed.upsert({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        userId,
        propertyId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking property view:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
