import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get current user's role
export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ role: null, isAgent: false, isAdmin: false })
    }

    const userId = session.user.id

    // Check user in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    // Check if user is an agent
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true },
    })

    return NextResponse.json({
      role: user?.role || 'USER',
      isAgent: !!agent,
      isAdmin: user?.role === 'ADMIN',
    })
  } catch (error) {
    console.error('Error fetching user role:', error)
    return NextResponse.json({ role: 'USER', isAgent: false, isAdmin: false })
  }
}
