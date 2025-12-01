import { getUserById } from '@/lib/auth'
import { getAgentByUserId, getAgentListingsCount } from '@/lib/agents'
import { AgentCard, OwnerContactCard } from './AgentCard'

interface AgentSidebarProps {
  ownerId: string
  propertyId: string
}

export async function AgentSidebar({ ownerId, propertyId }: AgentSidebarProps) {
  // Try to get agent profile for this owner
  const agent = await getAgentByUserId(ownerId)

  if (!agent) {
    // Owner is not a registered agent, show simple contact card
    return <OwnerContactCard ownerId={ownerId} />
  }

  // Get agent's listing count
  const listingsCount = await getAgentListingsCount(ownerId)

  // Get photo from agent record or fallback to user image
  let photo = agent.photo
  if (!photo && agent.userId) {
    try {
      const dbUser = await getUserById(agent.userId)
      photo = dbUser?.image || null
    } catch {
      // User might not exist
    }
  }

  return (
    <AgentCard
      agent={{
        id: agent.id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        photo,
        phone: agent.phone,
        email: agent.email,
        whatsapp: agent.whatsapp,
        telegram: agent.telegram,
        verified: agent.verified,
        superAgent: agent.superAgent,
        responseTime: agent.responseTime,
        rating: agent.rating,
        reviewCount: agent.reviewCount,
        yearsExperience: agent.yearsExperience,
        showPhone: agent.showPhone,
        agency: agent.agency ? {
          id: agent.agency.id,
          name: agent.agency.name,
          logo: agent.agency.logo,
          yearsOnPlatform: agent.agency.yearsOnPlatform,
          verified: agent.agency.verified,
        } : null,
      }}
      listingsCount={listingsCount}
      propertyId={propertyId}
    />
  )
}
