import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET - Get agent stats for dashboard
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an agent
    const agent = await prisma.agent.findUnique({
      where: { userId },
      include: {
        agency: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!agent) {
      return NextResponse.json({ message: 'Not an agent' }, { status: 403 })
    }

    // Get agent's listings (properties they own)
    const listings = await prisma.property.findMany({
      where: { userId },
      include: {
        images: { take: 1 },
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate stats
    const totalListings = listings.length
    const activeListings = listings.filter(l => l.status === 'ACTIVE').length
    const soldListings = listings.filter(l => l.status === 'SOLD').length
    const rentedListings = listings.filter(l => l.status === 'RENTED').length
    const totalViews = listings.reduce((sum, l) => sum + l.views, 0)
    const totalFavorites = listings.reduce((sum, l) => sum + l._count.favorites, 0)

    // Get viewings for agent's properties
    const viewings = await prisma.viewing.findMany({
      where: { ownerId: userId },
      orderBy: { date: 'desc' },
      take: 10,
    })

    const pendingViewings = viewings.filter(v => v.status === 'PENDING').length
    const confirmedViewings = viewings.filter(v => v.status === 'CONFIRMED').length

    // Get messages/conversations count
    const conversations = await prisma.conversation.count({
      where: {
        OR: [
          { participant1: userId },
          { participant2: userId },
        ],
      },
    })

    // Get unread messages count
    const unreadMessages = await prisma.message.count({
      where: {
        conversation: {
          OR: [
            { participant1: userId },
            { participant2: userId },
          ],
        },
        senderId: { not: userId },
        read: false,
      },
    })

    // Monthly stats (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newListingsThisMonth = listings.filter(
      l => new Date(l.createdAt) >= thirtyDaysAgo
    ).length

    const viewingsThisMonth = viewings.filter(
      v => new Date(v.date) >= thirtyDaysAgo
    ).length

    return NextResponse.json({
      agent: {
        id: agent.id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        photo: agent.photo,
        verified: agent.verified,
        superAgent: agent.superAgent,
        rating: agent.rating,
        reviewCount: agent.reviewCount,
        yearsExperience: agent.yearsExperience,
        totalDeals: agent.totalDeals,
        agency: agent.agency,
      },
      stats: {
        totalListings,
        activeListings,
        soldListings,
        rentedListings,
        totalViews,
        totalFavorites,
        pendingViewings,
        confirmedViewings,
        conversations,
        unreadMessages,
        newListingsThisMonth,
        viewingsThisMonth,
      },
      recentListings: listings.slice(0, 5).map(l => ({
        id: l.id,
        title: l.title,
        price: l.price,
        status: l.status,
        listingType: l.listingType,
        views: l.views,
        favorites: l._count.favorites,
        image: l.images[0]?.url,
        createdAt: l.createdAt,
      })),
      recentReviews: agent.reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        dealType: r.dealType,
        createdAt: r.createdAt,
      })),
      recentViewings: viewings.slice(0, 5).map(v => ({
        id: v.id,
        propertyId: v.propertyId,
        date: v.date,
        time: v.time,
        status: v.status,
        message: v.message,
      })),
    })
  } catch (error) {
    console.error('Error fetching agent stats:', error)
    return NextResponse.json(
      { message: 'Failed to fetch agent stats' },
      { status: 500 }
    )
  }
}
