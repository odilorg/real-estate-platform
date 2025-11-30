import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // First, find the user who owns properties (likely your user)
  const properties = await prisma.property.findMany({
    select: { userId: true },
    distinct: ['userId'],
  })

  console.log('Found user IDs with properties:', properties.map(p => p.userId))

  // Get the main user (the one with the most properties)
  const userCounts = await prisma.property.groupBy({
    by: ['userId'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  })

  console.log('User property counts:', userCounts)

  const mainUserId = userCounts[0]?.userId

  if (!mainUserId) {
    console.log('No users with properties found')
    return
  }

  console.log('Creating agent for user:', mainUserId)

  // Create user profile if not exists
  await prisma.userProfile.upsert({
    where: { clerkId: mainUserId },
    update: { role: 'AGENT' },
    create: { clerkId: mainUserId, role: 'AGENT' },
  })

  // Create agency first
  const agency = await prisma.agency.upsert({
    where: { slug: 'ulric-realty' },
    update: {},
    create: {
      name: 'Ulric Realty Group',
      slug: 'ulric-realty',
      description: 'Premium real estate services in Uzbekistan and beyond. We specialize in residential and commercial properties.',
      email: 'contact@ulricrealty.com',
      phone: '+998 90 123 4567',
      city: 'Tashkent',
      yearsOnPlatform: 3,
      verified: true,
    },
  })

  console.log('Agency created:', agency)

  // Create agent profile
  const agent = await prisma.agent.upsert({
    where: { userId: mainUserId },
    update: {
      firstName: 'Ulric',
      lastName: 'Odil',
      bio: 'Experienced real estate professional with over 5 years in the industry. Specializing in luxury properties and investment opportunities.',
      phone: '+998 90 123 4567',
      email: 'ulric@ulricrealty.com',
      whatsapp: '+998901234567',
      telegram: '@ulric_realty',
      yearsExperience: 5,
      totalDeals: 47,
      verified: true,
      superAgent: true,
      responseTime: 'fast',
      rating: 4.8,
      reviewCount: 23,
      specializations: JSON.stringify(['residential', 'commercial', 'luxury', 'investment']),
      languages: JSON.stringify(['en', 'ru', 'uz']),
      areasServed: JSON.stringify(['Tashkent', 'Samarkand', 'Bukhara']),
      agencyId: agency.id,
    },
    create: {
      userId: mainUserId,
      firstName: 'Ulric',
      lastName: 'Odil',
      bio: 'Experienced real estate professional with over 5 years in the industry. Specializing in luxury properties and investment opportunities.',
      phone: '+998 90 123 4567',
      email: 'ulric@ulricrealty.com',
      whatsapp: '+998901234567',
      telegram: '@ulric_realty',
      yearsExperience: 5,
      totalDeals: 47,
      verified: true,
      superAgent: true,
      responseTime: 'fast',
      rating: 4.8,
      reviewCount: 23,
      specializations: JSON.stringify(['residential', 'commercial', 'luxury', 'investment']),
      languages: JSON.stringify(['en', 'ru', 'uz']),
      areasServed: JSON.stringify(['Tashkent', 'Samarkand', 'Bukhara']),
      agencyId: agency.id,
    },
  })

  console.log('Agent created:', agent)

  // Add some reviews
  const reviewers = ['demo_user_1', 'demo_user_2', 'demo_user_3']
  for (const reviewerId of reviewers) {
    try {
      await prisma.agentReview.upsert({
        where: {
          agentId_userId: {
            agentId: agent.id,
            userId: reviewerId,
          },
        },
        update: {},
        create: {
          agentId: agent.id,
          userId: reviewerId,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
          comment: 'Great agent, very professional and helpful!',
          dealType: 'bought',
        },
      })
    } catch (e) {
      // Ignore if review already exists
    }
  }

  console.log('Agent setup complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
