import { NextResponse } from 'next/server'
import { getUserById } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const verified = searchParams.get('verified') === 'true'
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'default'

    const where: any = {}

    if (city) {
      where.city = city
    }

    if (verified) {
      where.verified = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { city: { contains: search } },
      ]
    }

    // Determine sort order
    let orderBy: any = [
      { verified: 'desc' },
      { yearsOnPlatform: 'desc' },
    ]

    if (sortBy === 'name') {
      orderBy = { name: 'asc' }
    } else if (sortBy === 'agents') {
      // Will sort after fetching due to relation count
    } else if (sortBy === 'experience') {
      orderBy = { yearsOnPlatform: 'desc' }
    }

    const agencies = await prisma.agency.findMany({
      where,
      include: {
        agents: {
          select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
            photo: true,
            verified: true,
            superAgent: true,
            rating: true,
            reviewCount: true,
          },
        },
      },
      orderBy: sortBy !== 'agents' ? orderBy : undefined,
    })

    // Calculate stats for each agency
    const agenciesWithStats = await Promise.all(
      agencies.map(async (agency) => {
        // Count total listings from all agents in this agency
        const agentUserIds = agency.agents.map(a => a.id)

        // Get total listings count for all agents
        let totalListings = 0
        for (const agent of agency.agents) {
          const agentData = await prisma.agent.findUnique({
            where: { id: agent.id },
            select: { userId: true }
          })
          if (agentData) {
            const count = await prisma.property.count({
              where: { userId: agentData.userId, status: 'ACTIVE' }
            })
            totalListings += count
          }
        }

        // Calculate average rating across all agents
        const agentRatings = agency.agents
          .filter(a => a.rating && a.rating > 0)
          .map(a => a.rating!)
        const avgRating = agentRatings.length > 0
          ? agentRatings.reduce((sum, r) => sum + r, 0) / agentRatings.length
          : 0

        // Total reviews across all agents
        const totalReviews = agency.agents.reduce((sum, a) => sum + (a.reviewCount || 0), 0)

        // Fetch user images for agents without photos
        const agentsWithPhotos = await Promise.all(
          agency.agents.slice(0, 5).map(async (agent) => {
            let photo = agent.photo
            if (!photo && agent.userId) {
              try {
                const user = await getUserById(agent.userId)
                photo = user?.image || null
              } catch {
                // User might not exist
              }
            }
            return {
              id: agent.id,
              firstName: agent.firstName,
              lastName: agent.lastName,
              photo,
              verified: agent.verified,
              superAgent: agent.superAgent,
            }
          })
        )

        return {
          id: agency.id,
          name: agency.name,
          slug: agency.slug,
          logo: agency.logo,
          description: agency.description,
          website: agency.website,
          email: agency.email,
          phone: agency.phone,
          address: agency.address,
          city: agency.city,
          yearsOnPlatform: agency.yearsOnPlatform,
          verified: agency.verified,
          agentsCount: agency.agents.length,
          totalListings,
          avgRating: Math.round(avgRating * 10) / 10,
          totalReviews,
          agents: agentsWithPhotos, // Return first 5 agents with photos for preview
        }
      })
    )

    // Sort by agents count if requested
    if (sortBy === 'agents') {
      agenciesWithStats.sort((a, b) => b.agentsCount - a.agentsCount)
    }

    return NextResponse.json({ agencies: agenciesWithStats })
  } catch (error) {
    console.error('Error fetching agencies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agencies' },
      { status: 500 }
    )
  }
}
