import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET - Check application status
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ status: 'none' })
    }

    // Check if already an agent
    const agent = await prisma.agent.findUnique({
      where: { userId },
    })

    if (agent) {
      return NextResponse.json({ status: 'APPROVED', isAgent: true })
    }

    // Check application status
    const application = await prisma.agentApplication.findUnique({
      where: { userId },
      select: {
        status: true,
        rejectionReason: true,
        createdAt: true,
        reviewedAt: true,
      },
    })

    if (!application) {
      return NextResponse.json({ status: 'none' })
    }

    return NextResponse.json({
      status: application.status,
      rejectionReason: application.rejectionReason,
      appliedAt: application.createdAt,
      reviewedAt: application.reviewedAt,
    })
  } catch (error) {
    console.error('Error checking application status:', error)
    return NextResponse.json({ status: 'none' })
  }
}
