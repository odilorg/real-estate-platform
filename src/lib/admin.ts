import { auth, clerkClient } from '@clerk/nextjs/server'

export type UserRole = 'admin' | 'moderator' | 'user'

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  try {
    const user = await (await clerkClient()).users.getUser(userId)
    const role = user.publicMetadata?.role as UserRole
    return role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Check if the current user is an admin or moderator
 */
export async function isModerator(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  try {
    const user = await (await clerkClient()).users.getUser(userId)
    const role = user.publicMetadata?.role as UserRole
    return role === 'admin' || role === 'moderator'
  } catch (error) {
    console.error('Error checking moderator status:', error)
    return false
  }
}

/**
 * Get the current user's role
 */
export async function getUserRole(): Promise<UserRole> {
  const { userId } = await auth()
  if (!userId) return 'user'

  try {
    const user = await (await clerkClient()).users.getUser(userId)
    return (user.publicMetadata?.role as UserRole) || 'user'
  } catch (error) {
    console.error('Error getting user role:', error)
    return 'user'
  }
}

/**
 * Set a user's role (admin only)
 */
export async function setUserRole(targetUserId: string, role: UserRole): Promise<boolean> {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    throw new Error('Unauthorized: Admin access required')
  }

  try {
    await (await clerkClient()).users.updateUser(targetUserId, {
      publicMetadata: { role },
    })
    return true
  } catch (error) {
    console.error('Error setting user role:', error)
    return false
  }
}
