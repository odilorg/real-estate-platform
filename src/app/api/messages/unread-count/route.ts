import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 })
    }

    const userId = session.user.id

    // Count unread messages where user is a participant but not the sender
    const unreadCount = await prisma.message.count({
      where: {
        read: false,
        senderId: { not: userId },
        conversation: {
          OR: [
            { participant1: userId },
            { participant2: userId },
          ],
        },
      },
    })

    return NextResponse.json({ count: unreadCount })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return NextResponse.json({ count: 0 })
  }
}
