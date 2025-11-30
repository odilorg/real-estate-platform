import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET - List all agent applications (admin only)
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

    const applications = await prisma.agentApplication.findMany({
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { message: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
