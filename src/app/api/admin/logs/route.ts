import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAdminLogs } from '@/lib/db'

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
