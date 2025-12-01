import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getAllProperties, updateProperty } from '@/lib/db'
import { prisma } from '@/lib/prisma'

// This is a one-time utility endpoint to assign owners to properties
export async function POST() {
  try {
    const session = await getSession()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const properties = await getAllProperties()

    // Get some users from the database (or use current user for all)
    const users = await prisma.user.findMany({
      take: 10,
      select: { id: true },
    })

    if (users.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 400 })
    }

    // Assign owners to properties that don't have one
    let updatedCount = 0
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      if (!property.userId) {
        // Distribute properties among available users
        const ownerIndex = i % users.length
        const ownerId = users[ownerIndex].id

        await updateProperty(property.id, { userId: ownerId })
        updatedCount++
      }
    }

    return NextResponse.json({
      message: `Successfully assigned owners to ${updatedCount} properties`,
      updatedCount,
      totalProperties: properties.length,
    })
  } catch (error) {
    console.error('Error assigning owners:', error)
    return NextResponse.json(
      { error: 'Failed to assign owners' },
      { status: 500 }
    )
  }
}
