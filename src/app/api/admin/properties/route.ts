import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAdminProperties, adminDeleteProperty, logAdminAction } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined

    const properties = await getAdminProperties({ status, search })
    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching admin properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { propertyId, reason } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
    }

    await adminDeleteProperty(propertyId)

    // Log the action
    await logAdminAction({
      adminId: userId,
      action: 'DELETE_PROPERTY',
      targetType: 'PROPERTY',
      targetId: propertyId,
      details: reason ? JSON.stringify({ reason }) : undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
