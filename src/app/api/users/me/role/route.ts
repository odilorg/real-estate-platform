import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET - Get current user's role
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ role: null, isAgent: false, isAdmin: false })
    }

    // Check user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkId: userId },
    })

    // Check if user is an agent
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true },
    })

    return NextResponse.json({
      role: userProfile?.role || 'USER',
      isAgent: !!agent,
      isAdmin: userProfile?.role === 'ADMIN',
    })
  } catch (error) {
    console.error('Error fetching user role:', error)
    return NextResponse.json({ role: 'USER', isAgent: false, isAdmin: false })
  }
}
