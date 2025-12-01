import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export type UserRole = 'ADMIN' | 'AGENT' | 'USER'

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession()
  if (!session?.user?.id) return false

  return session.user.role === 'ADMIN'
}

/**
 * Check if the current user is an admin or agent (moderator-level)
 */
export async function isModerator(): Promise<boolean> {
  const session = await getSession()
  if (!session?.user?.id) return false

  return session.user.role === 'ADMIN' || session.user.role === 'AGENT'
}

/**
 * Get the current user's role
 */
export async function getUserRole(): Promise<UserRole> {
  const session = await getSession()
  if (!session?.user?.id) return 'USER'

  return (session.user.role as UserRole) || 'USER'
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
    await prisma.user.update({
      where: { id: targetUserId },
      data: { role },
    })
    return true
  } catch (error) {
    console.error('Error setting user role:', error)
    return false
  }
}
