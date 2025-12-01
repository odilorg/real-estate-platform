import { prisma } from './prisma'

// Get agent by user ID (Clerk ID)
export async function getAgentByUserId(userId: string) {
  return prisma.agent.findUnique({
    where: { userId },
    include: {
      agency: true,
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })
}

// Get agent by ID
export async function getAgentById(agentId: string) {
  return prisma.agent.findUnique({
    where: { id: agentId },
    include: {
      agency: true,
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })
}

// Get agent's listings count
export async function getAgentListingsCount(userId: string) {
  return prisma.property.count({
    where: { userId },
  })
}

// Get agent's active listings
export async function getAgentListings(userId: string, limit = 10) {
  return prisma.property.findMany({
    where: { userId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      images: { take: 1 },
    },
  })
}

// Get agency by ID
export async function getAgencyById(agencyId: string) {
  return prisma.agency.findUnique({
    where: { id: agencyId },
    include: {
      agents: {
        include: {
          reviews: true,
        },
      },
    },
  })
}

// Get agency by slug
export async function getAgencyBySlug(slug: string) {
  return prisma.agency.findUnique({
    where: { slug },
    include: {
      agents: {
        include: {
          reviews: true,
        },
      },
    },
  })
}

// Create or update agent profile
export async function upsertAgent(
  userId: string,
  data: {
    firstName: string
    lastName: string
    phone?: string
    email?: string
    bio?: string
    photo?: string
    whatsapp?: string
    telegram?: string
    licenseNumber?: string
    specializations?: string[]
    languages?: string[]
    areasServed?: string[]
    yearsExperience?: number
    agencyId?: string
  }
) {
  // Ensure user has AGENT role
  await prisma.user.update({
    where: { id: userId },
    data: { role: 'AGENT' },
  })

  return prisma.agent.upsert({
    where: { userId },
    update: {
      ...data,
      specializations: data.specializations ? JSON.stringify(data.specializations) : undefined,
      languages: data.languages ? JSON.stringify(data.languages) : undefined,
      areasServed: data.areasServed ? JSON.stringify(data.areasServed) : undefined,
    },
    create: {
      userId,
      ...data,
      specializations: data.specializations ? JSON.stringify(data.specializations) : null,
      languages: data.languages ? JSON.stringify(data.languages) : null,
      areasServed: data.areasServed ? JSON.stringify(data.areasServed) : null,
    },
  })
}

// Get all agents (for directory)
export async function getAllAgents(options?: {
  city?: string
  verified?: boolean
  superAgent?: boolean
  limit?: number
  offset?: number
}) {
  const where: any = {}

  if (options?.verified) where.verified = true
  if (options?.superAgent) where.superAgent = true

  return prisma.agent.findMany({
    where,
    include: {
      agency: true,
    },
    orderBy: [
      { superAgent: 'desc' },
      { verified: 'desc' },
      { rating: 'desc' },
    ],
    take: options?.limit || 20,
    skip: options?.offset || 0,
  })
}

// Add agent review
export async function addAgentReview(
  agentId: string,
  userId: string,
  data: {
    rating: number
    comment?: string
    dealType?: string
  }
) {
  const review = await prisma.agentReview.create({
    data: {
      agentId,
      userId,
      ...data,
    },
  })

  // Update agent's rating
  const reviews = await prisma.agentReview.findMany({
    where: { agentId },
    select: { rating: true },
  })

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  await prisma.agent.update({
    where: { id: agentId },
    data: {
      rating: avgRating,
      reviewCount: reviews.length,
    },
  })

  return review
}

// Create agency
export async function createAgency(data: {
  name: string
  slug: string
  logo?: string
  description?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  city?: string
}) {
  return prisma.agency.create({
    data,
  })
}

// Helper to parse JSON fields
export function parseAgentJsonFields(agent: any) {
  return {
    ...agent,
    specializations: agent.specializations ? JSON.parse(agent.specializations) : [],
    languages: agent.languages ? JSON.parse(agent.languages) : [],
    areasServed: agent.areasServed ? JSON.parse(agent.areasServed) : [],
  }
}
