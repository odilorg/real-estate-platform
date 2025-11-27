import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getAllUserProfiles, isUserAdmin, banUser, unbanUser, updateUserRole, logAdminAction } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await isUserAdmin(userId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const users = await getAllUserProfiles()
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
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await isUserAdmin(userId)
    if (!isAdmin) {
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
        await banUser(targetUserId, reason)
        await logAdminAction({
          adminId: userId,
          action: 'BAN_USER',
          targetType: 'USER',
          targetId: targetUserId,
          details: reason ? JSON.stringify({ reason }) : undefined,
        })
        break
      case 'unban':
        await unbanUser(targetUserId)
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
        await updateUserRole(targetUserId, role)
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
