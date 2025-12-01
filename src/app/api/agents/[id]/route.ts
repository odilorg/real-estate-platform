import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = await clerkClient()
    const { id } = await params

    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        agency: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Get agent's listings
    const listings = await prisma.property.findMany({
      where: {
        userId: agent.userId,
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

    // Get listing stats
    const totalListings = await prisma.property.count({
      where: { userId: agent.userId },
    })

    const activeListings = await prisma.property.count({
      where: { userId: agent.userId, status: 'ACTIVE' },
    })

    const soldListings = await prisma.property.count({
      where: { userId: agent.userId, status: 'SOLD' },
    })

    // Calculate average rating
    const avgRating = agent.reviews.length > 0
      ? agent.reviews.reduce((sum, r) => sum + r.rating, 0) / agent.reviews.length
      : 0

    // Parse JSON fields
    const specializations = agent.specializations ? JSON.parse(agent.specializations) : []
    const languages = agent.languages ? JSON.parse(agent.languages) : []
    const areasServed = agent.areasServed ? JSON.parse(agent.areasServed) : []

    // Get photo from agent record or fallback to Clerk user image
    let photo = agent.photo
    if (!photo && agent.userId) {
      try {
        const clerkUser = await client.users.getUser(agent.userId)
        photo = clerkUser.imageUrl || null
      } catch {
        // User might not exist in Clerk
      }
    }

    return NextResponse.json({
      agent: {
        ...agent,
        photo,
        specializations,
        languages,
        areasServed,
        avgRating: Math.round(avgRating * 10) / 10,
      },
      listings: listings.map((listing) => ({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        listingType: listing.listingType,
        propertyType: listing.propertyType,
        city: listing.city,
        state: listing.state,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        area: listing.area,
        images: listing.images.map((img) => img.url),
      })),
      stats: {
        totalListings,
        activeListings,
        soldListings,
        reviewCount: agent.reviews.length,
        avgRating: Math.round(avgRating * 10) / 10,
      },
    })
  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    )
  }
}
