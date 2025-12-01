import { NextResponse } from 'next/server'
import { getUserById } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const specialization = searchParams.get('specialization')
    const verified = searchParams.get('verified') === 'true'
    const superAgent = searchParams.get('superAgent') === 'true'

    const where: any = {}

    if (city) {
      where.areasServed = { contains: city }
    }

    if (specialization) {
      where.specializations = { contains: specialization }
    }

    if (verified) {
      where.verified = true
    }

    if (superAgent) {
      where.superAgent = true
    }

    const agents = await prisma.agent.findMany({
      where,
      include: {
        agency: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: [
        { superAgent: 'desc' },
        { verified: 'desc' },
        { rating: 'desc' },
      ],
    })

    // Calculate stats for each agent and fetch user image as fallback
    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
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
          agency: agent.agency,
          listingsCount,
          reviewCount: agent.reviews.length,
          avgRating: Math.round(avgRating * 10) / 10,
        }
      })
    )

    return NextResponse.json({ agents: agentsWithStats })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}
