import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getAdminLogs, isUserAdmin } from '@/lib/db'

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

    const logs = await getAdminLogs(100)
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching admin logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}
