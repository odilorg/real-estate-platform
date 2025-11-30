import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET - List all agents (admin only)
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkId: userId },
    })

    if (userProfile?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const agents = await prisma.agent.findMany({
      include: {
        agency: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { message: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}
