import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// POST - Submit agent application
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has an application
    const existingApplication = await prisma.agentApplication.findUnique({
      where: { userId },
    })

    if (existingApplication) {
      if (existingApplication.status === 'PENDING') {
        return NextResponse.json(
          { message: 'You already have a pending application' },
          { status: 400 }
        )
      }
      if (existingApplication.status === 'APPROVED') {
        return NextResponse.json(
          { message: 'You are already an approved agent' },
          { status: 400 }
        )
      }
    }

    // Check if user is already an agent
    const existingAgent = await prisma.agent.findUnique({
      where: { userId },
    })

    if (existingAgent) {
      return NextResponse.json(
        { message: 'You are already registered as an agent' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      licenseNumber,
      yearsExperience,
      bio,
      specializations,
      areasServed,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !bio || !areasServed?.length) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      )
    }

    // Create or update application
    const application = await prisma.agentApplication.upsert({
      where: { userId },
      update: {
        firstName,
        lastName,
        email,
        phone,
        companyName: companyName || null,
        licenseNumber: licenseNumber || null,
        yearsExperience: yearsExperience || 0,
        bio,
        specializations: JSON.stringify(specializations || []),
        areasServed: JSON.stringify(areasServed || []),
        status: 'PENDING',
        rejectionReason: null,
        reviewedBy: null,
        reviewedAt: null,
      },
      create: {
        userId,
        firstName,
        lastName,
        email,
        phone,
        companyName: companyName || null,
        licenseNumber: licenseNumber || null,
        yearsExperience: yearsExperience || 0,
        bio,
        specializations: JSON.stringify(specializations || []),
        areasServed: JSON.stringify(areasServed || []),
      },
    })

    return NextResponse.json({ application, message: 'Application submitted successfully' })
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { message: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
