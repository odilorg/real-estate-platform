import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// POST - Reject agent application
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params

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

    // Get the application
    const application = await prisma.agentApplication.findUnique({
      where: { id },
    })

    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 })
    }

    if (application.status !== 'PENDING') {
      return NextResponse.json({ message: 'Application already processed' }, { status: 400 })
    }

    const body = await request.json()
    const { reason } = body

    // Update application status
    await prisma.agentApplication.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason || null,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: userId,
        action: 'REJECT_AGENT',
        targetType: 'AGENT_APPLICATION',
        targetId: id,
        details: JSON.stringify({ reason }),
      },
    })

    return NextResponse.json({ message: 'Application rejected' })
  } catch (error) {
    console.error('Error rejecting application:', error)
    return NextResponse.json(
      { message: 'Failed to reject application' },
      { status: 500 }
    )
  }
}
