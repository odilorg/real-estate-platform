import { NextRequest, NextResponse } from 'next/server'
import { setUserRole } from '@/lib/admin'

export async function PUT(request: NextRequest) {
  try {
    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing userId or role' },
        { status: 400 }
      )
    }

    if (!['user', 'moderator', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    await setUserRole(userId, role)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update role' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    )
  }
}
