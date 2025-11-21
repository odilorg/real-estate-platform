import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/dataStore'

// This is a one-time utility endpoint to assign owners to properties
export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dataStore = getDataStore()
    const properties = dataStore.getAllProperties()

    // Get some random user IDs from Clerk (or use current user for all)
    const client = await clerkClient()
    const usersResponse = await client.users.getUserList({ limit: 10 })
    const users = usersResponse.data

    if (users.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 400 })
    }

    // Assign owners to properties that don't have one
    let updatedCount = 0
    properties.forEach((property, index) => {
      if (!property.userId) {
        // Distribute properties among available users
        const ownerIndex = index % users.length
        const ownerId = users[ownerIndex].id

        dataStore.updateProperty(property.id, { userId: ownerId })
        updatedCount++
      }
    })

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
