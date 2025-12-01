import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logAdminAction } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        banned: true,
        banReason: true,
        createdAt: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { targetUserId, action, reason, role } = await request.json()

    if (!targetUserId || !action) {
      return NextResponse.json({ error: 'User ID and action required' }, { status: 400 })
    }

    // Prevent admin from modifying themselves
    if (targetUserId === userId) {
      return NextResponse.json({ error: 'Cannot modify your own account' }, { status: 400 })
    }

    switch (action) {
      case 'ban':
        await prisma.user.update({
          where: { id: targetUserId },
          data: { banned: true, banReason: reason },
        })
        await logAdminAction({
          adminId: userId,
          action: 'BAN_USER',
          targetType: 'USER',
          targetId: targetUserId,
          details: reason ? JSON.stringify({ reason }) : undefined,
        })
        break
      case 'unban':
        await prisma.user.update({
          where: { id: targetUserId },
          data: { banned: false, banReason: null },
        })
        await logAdminAction({
          adminId: userId,
          action: 'UNBAN_USER',
          targetType: 'USER',
          targetId: targetUserId,
        })
        break
      case 'updateRole':
        if (!role) {
          return NextResponse.json({ error: 'Role required' }, { status: 400 })
        }
        await prisma.user.update({
          where: { id: targetUserId },
          data: { role },
        })
        await logAdminAction({
          adminId: userId,
          action: 'UPDATE_ROLE',
          targetType: 'USER',
          targetId: targetUserId,
          details: JSON.stringify({ role }),
        })
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error modifying user:', error)
    return NextResponse.json(
      { error: 'Failed to modify user' },
      { status: 500 }
    )
  }
}
