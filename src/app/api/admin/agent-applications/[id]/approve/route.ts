import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// POST - Approve agent application
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

    // Create agent profile from application
    const agent = await prisma.agent.create({
      data: {
        userId: application.userId,
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        bio: application.bio,
        licenseNumber: application.licenseNumber,
        specializations: application.specializations,
        areasServed: application.areasServed,
        yearsExperience: application.yearsExperience,
        verified: false, // Start unverified, admin can verify later
        superAgent: false,
        rating: 0,
        reviewCount: 0,
      },
    })

    // Update application status
    await prisma.agentApplication.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    })

    // Update user profile role
    await prisma.userProfile.upsert({
      where: { clerkId: application.userId },
      update: { role: 'AGENT' },
      create: { clerkId: application.userId, role: 'AGENT' },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: userId,
        action: 'APPROVE_AGENT',
        targetType: 'AGENT_APPLICATION',
        targetId: id,
        details: JSON.stringify({ agentId: agent.id }),
      },
    })

    return NextResponse.json({ agent, message: 'Application approved' })
  } catch (error) {
    console.error('Error approving application:', error)
    return NextResponse.json(
      { message: 'Failed to approve application' },
      { status: 500 }
    )
  }
}
