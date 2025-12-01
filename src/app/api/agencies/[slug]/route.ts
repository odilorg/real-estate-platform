import { NextResponse } from 'next/server'
import { getUserById } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const agency = await prisma.agency.findUnique({
      where: { slug },
      include: {
        agents: {
          include: {
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    })

    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      )
    }

    // Calculate stats for each agent and the agency
    const agentsWithStats = await Promise.all(
      agency.agents.map(async (agent) => {
        const listingsCount = await prisma.property.count({
          where: { userId: agent.userId, status: 'ACTIVE' },
        })

        const avgRating = agent.reviews.length > 0
          ? agent.reviews.reduce((sum, r) => sum + r.rating, 0) / agent.reviews.length
          : 0

        // Get photo from agent record or fallback to user image
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
          phone: agent.showPhone ? agent.phone : null,
          email: agent.showEmail ? agent.email : null,
          whatsapp: agent.whatsapp,
          telegram: agent.telegram,
          yearsExperience: agent.yearsExperience,
          verified: agent.verified,
          superAgent: agent.superAgent,
          responseTime: agent.responseTime,
          specializations: agent.specializations ? JSON.parse(agent.specializations) : [],
          languages: agent.languages ? JSON.parse(agent.languages) : [],
          areasServed: agent.areasServed ? JSON.parse(agent.areasServed) : [],
          listingsCount,
          reviewCount: agent.reviews.length,
          avgRating: Math.round(avgRating * 10) / 10,
        }
      })
    )

    // Calculate agency totals
    const totalListings = agentsWithStats.reduce((sum, a) => sum + a.listingsCount, 0)
    const totalReviews = agentsWithStats.reduce((sum, a) => sum + a.reviewCount, 0)
    const agentRatings = agentsWithStats.filter(a => a.avgRating > 0).map(a => a.avgRating)
    const avgRating = agentRatings.length > 0
      ? agentRatings.reduce((sum, r) => sum + r, 0) / agentRatings.length
      : 0

    return NextResponse.json({
      agency: {
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
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10,
        agents: agentsWithStats,
      },
    })
  } catch (error) {
    console.error('Error fetching agency:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agency' },
      { status: 500 }
    )
  }
}
