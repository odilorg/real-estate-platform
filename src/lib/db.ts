import { prisma } from './prisma'
import type { Prisma } from '@prisma/client'

// Type aliases for property/listing types
type PropertyType = string
type ListingType = string

// ============ Property Operations ============

// Agent/Seller info for property cards
interface PropertyAgent {
  id: string
  firstName: string
  lastName: string
  photo?: string | null
  phone?: string | null
  verified: boolean
  showPhone: boolean
  agency?: {
    id: string
    name: string
    logo?: string | null
  } | null
}

export interface PropertyWithRelations {
  id: string
  userId: string
  title: string
  description: string
  price: number
  propertyType: PropertyType
  listingType: ListingType
  status: string
  address: string
  city: string
  state: string | null
  country: string
  zipCode: string | null
  latitude: number | null
  longitude: number | null
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  yearBuilt: number | null
  floor: number | null
  totalFloors: number | null
  parking: number | null
  views: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
  images: string[]
  amenities: string[]
  agent?: PropertyAgent | null
}

// Transform Prisma property to our expected format
function transformProperty(property: any): PropertyWithRelations {
  return {
    ...property,
    images: property.images?.map((img: any) => img.url) || [],
    amenities: property.amenities?.map((a: any) => a.amenity) || [],
    agent: property.agent ? {
      id: property.agent.id,
      firstName: property.agent.firstName,
      lastName: property.agent.lastName,
      photo: property.agent.photo,
      phone: property.agent.phone,
      verified: property.agent.verified,
      showPhone: property.agent.showPhone,
      agency: property.agent.agency ? {
        id: property.agent.agency.id,
        name: property.agent.agency.name,
        logo: property.agent.agency.logo,
      } : null,
    } : null,
  }
}

export async function getAllProperties(): Promise<PropertyWithRelations[]> {
  const properties = await prisma.property.findMany({
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return properties.map(transformProperty)
}

export async function getPropertyById(id: string): Promise<PropertyWithRelations | null> {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: true,
    },
  })
  return property ? transformProperty(property) : null
}

export async function getPropertiesByUserId(userId: string): Promise<PropertyWithRelations[]> {
  const properties = await prisma.property.findMany({
    where: { userId },
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return properties.map(transformProperty)
}

export interface SearchFilters {
  query?: string
  propertyType?: string
  listingType?: string
  propertyTypes?: string[]
  listingTypes?: string[]
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
  minArea?: number
  maxArea?: number
  city?: string
  state?: string
  amenities?: string[]
  latitude?: number
  longitude?: number
  radius?: number
  // Enhanced CIAN-style filters
  buildingClasses?: string[]
  renovationTypes?: string[]
  parkingTypes?: string[]
  maxMetroDistance?: number
  minPricePerSqFt?: number
  maxPricePerSqFt?: number
  minYearBuilt?: number
  maxYearBuilt?: number
  minFloor?: number
  maxFloor?: number
  hasBalcony?: boolean
  hasConcierge?: boolean
  hasGatedArea?: boolean
}

// Helper to fetch agents for properties by their userIds
async function fetchAgentsForProperties(properties: any[]): Promise<Map<string, PropertyAgent>> {
  const userIds = [...new Set(properties.map(p => p.userId))]
  const agents = await prisma.agent.findMany({
    where: { userId: { in: userIds } },
    include: { agency: true },
  })

  const agentMap = new Map<string, PropertyAgent>()
  for (const agent of agents) {
    agentMap.set(agent.userId, {
      id: agent.id,
      firstName: agent.firstName,
      lastName: agent.lastName,
      photo: agent.photo,
      phone: agent.phone,
      verified: agent.verified,
      showPhone: agent.showPhone,
      agency: agent.agency ? {
        id: agent.agency.id,
        name: agent.agency.name,
        logo: agent.agency.logo,
      } : null,
    })
  }
  return agentMap
}

export async function searchProperties(filters: SearchFilters): Promise<PropertyWithRelations[]> {
  const where: Prisma.PropertyWhereInput = {
    status: 'ACTIVE',
  }

  if (filters.query) {
    where.OR = [
      { title: { contains: filters.query } },
      { description: { contains: filters.query } },
      { address: { contains: filters.query } },
      { city: { contains: filters.query } },
    ]
  }

  // Single property type filter
  if (filters.propertyType) {
    where.propertyType = filters.propertyType
  }

  // Multiple property types filter (from advanced filters)
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    where.propertyType = { in: filters.propertyTypes }
  }

  // Single listing type filter
  if (filters.listingType) {
    where.listingType = filters.listingType
  }

  // Multiple listing types filter (from advanced filters)
  if (filters.listingTypes && filters.listingTypes.length > 0) {
    where.listingType = { in: filters.listingTypes }
  }

  if (filters.minPrice !== undefined) {
    where.price = { ...where.price as any, gte: filters.minPrice }
  }

  if (filters.maxPrice !== undefined) {
    where.price = { ...where.price as any, lte: filters.maxPrice }
  }

  // Bedroom filters
  if (filters.minBedrooms !== undefined && filters.minBedrooms > 0) {
    where.bedrooms = { ...where.bedrooms as any, gte: filters.minBedrooms }
  }

  if (filters.maxBedrooms !== undefined && filters.maxBedrooms > 0) {
    where.bedrooms = { ...where.bedrooms as any, lte: filters.maxBedrooms }
  }

  // Bathroom filters
  if (filters.minBathrooms !== undefined && filters.minBathrooms > 0) {
    where.bathrooms = { ...where.bathrooms as any, gte: filters.minBathrooms }
  }

  if (filters.maxBathrooms !== undefined && filters.maxBathrooms > 0) {
    where.bathrooms = { ...where.bathrooms as any, lte: filters.maxBathrooms }
  }

  // Area filters
  if (filters.minArea !== undefined) {
    where.area = { ...where.area as any, gte: filters.minArea }
  }

  if (filters.maxArea !== undefined) {
    where.area = { ...where.area as any, lte: filters.maxArea }
  }

  if (filters.city) {
    where.city = { contains: filters.city }
  }

  if (filters.state) {
    where.state = { contains: filters.state }
  }

  // Enhanced CIAN-style filters
  if (filters.buildingClasses && filters.buildingClasses.length > 0) {
    where.buildingClass = { in: filters.buildingClasses }
  }

  if (filters.renovationTypes && filters.renovationTypes.length > 0) {
    where.renovation = { in: filters.renovationTypes }
  }

  if (filters.parkingTypes && filters.parkingTypes.length > 0) {
    where.parkingType = { in: filters.parkingTypes }
  }

  if (filters.maxMetroDistance !== undefined) {
    where.metroDistance = { lte: filters.maxMetroDistance }
  }

  if (filters.minYearBuilt !== undefined) {
    where.yearBuilt = { ...where.yearBuilt as any, gte: filters.minYearBuilt }
  }

  if (filters.maxYearBuilt !== undefined) {
    where.yearBuilt = { ...where.yearBuilt as any, lte: filters.maxYearBuilt }
  }

  if (filters.minFloor !== undefined) {
    where.floor = { ...where.floor as any, gte: filters.minFloor }
  }

  if (filters.maxFloor !== undefined) {
    where.floor = { ...where.floor as any, lte: filters.maxFloor }
  }

  if (filters.hasBalcony === true) {
    where.balcony = { gt: 0 }
  }

  if (filters.hasConcierge === true) {
    where.hasConcierge = true
  }

  if (filters.hasGatedArea === true) {
    where.hasGatedArea = true
  }

  const properties = await prisma.property.findMany({
    where,
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  let results = properties.map(transformProperty)

  // Filter by amenities (must have all requested)
  if (filters.amenities && filters.amenities.length > 0) {
    results = results.filter(p =>
      filters.amenities!.every(amenity => p.amenities.includes(amenity))
    )
  }

  // Filter by radius if coordinates provided
  if (filters.latitude && filters.longitude && filters.radius) {
    results = results.filter(p => {
      if (!p.latitude || !p.longitude) return false
      const distance = calculateDistance(
        filters.latitude!,
        filters.longitude!,
        p.latitude,
        p.longitude
      )
      return distance <= filters.radius!
    })
  }

  // Filter by price per sq ft (calculated field)
  if (filters.minPricePerSqFt !== undefined || filters.maxPricePerSqFt !== undefined) {
    results = results.filter(p => {
      if (!p.area || p.area === 0) return false
      const pricePerSqFt = p.price / p.area
      if (filters.minPricePerSqFt !== undefined && pricePerSqFt < filters.minPricePerSqFt) {
        return false
      }
      if (filters.maxPricePerSqFt !== undefined && pricePerSqFt > filters.maxPricePerSqFt) {
        return false
      }
      return true
    })
  }

  // Fetch agent data for all properties
  const agentMap = await fetchAgentsForProperties(properties)

  // Attach agent data to results
  return results.map(property => ({
    ...property,
    agent: agentMap.get(property.userId) || null,
  }))
}

export interface CreatePropertyData {
  userId: string
  title: string
  description: string
  price: number
  propertyType: string
  listingType: string
  status?: string
  address: string
  city: string
  state?: string
  country?: string
  zipCode?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  yearBuilt?: number
  floor?: number
  totalFloors?: number
  parking?: number
  images: string[]
  amenities?: string[]
  latitude?: number
  longitude?: number
}

export async function createProperty(data: CreatePropertyData): Promise<PropertyWithRelations> {
  const property = await prisma.property.create({
    data: {
      userId: data.userId,
      title: data.title,
      description: data.description,
      price: data.price,
      propertyType: data.propertyType,
      listingType: data.listingType,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country || 'USA',
      zipCode: data.zipCode,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area: data.area,
      yearBuilt: data.yearBuilt,
      floor: data.floor,
      totalFloors: data.totalFloors,
      parking: data.parking,
      latitude: data.latitude,
      longitude: data.longitude,
      images: {
        create: data.images.map((url, index) => ({
          url,
          order: index,
          isPrimary: index === 0,
        })),
      },
      amenities: {
        create: (data.amenities || []).map(amenity => ({
          amenity: amenity,
        })),
      },
    },
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: true,
    },
  })
  return transformProperty(property)
}

export async function updateProperty(
  id: string,
  data: Partial<CreatePropertyData>
): Promise<PropertyWithRelations | null> {
  // First delete existing images and amenities if they're being updated
  if (data.images) {
    await prisma.propertyImage.deleteMany({ where: { propertyId: id } })
  }
  if (data.amenities) {
    await prisma.propertyAmenity.deleteMany({ where: { propertyId: id } })
  }

  // Track price changes in history
  if (data.price !== undefined) {
    const currentProperty = await prisma.property.findUnique({
      where: { id },
      select: { price: true },
    })

    if (currentProperty && currentProperty.price !== data.price) {
      const changeType = data.price > currentProperty.price ? 'INCREASE' : 'DECREASE'
      await prisma.priceHistory.create({
        data: {
          propertyId: id,
          price: data.price,
          changeType,
        },
      })
    }
  }

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.price && { price: data.price }),
      ...(data.propertyType && { propertyType: data.propertyType }),
      ...(data.listingType && { listingType: data.listingType }),
      ...(data.status && { status: data.status }),
      ...(data.address && { address: data.address }),
      ...(data.city && { city: data.city }),
      ...(data.state !== undefined && { state: data.state }),
      ...(data.country && { country: data.country }),
      ...(data.zipCode !== undefined && { zipCode: data.zipCode }),
      ...(data.bedrooms !== undefined && { bedrooms: data.bedrooms }),
      ...(data.bathrooms !== undefined && { bathrooms: data.bathrooms }),
      ...(data.area !== undefined && { area: data.area }),
      ...(data.yearBuilt !== undefined && { yearBuilt: data.yearBuilt }),
      ...(data.floor !== undefined && { floor: data.floor }),
      ...(data.totalFloors !== undefined && { totalFloors: data.totalFloors }),
      ...(data.parking !== undefined && { parking: data.parking }),
      ...(data.latitude !== undefined && { latitude: data.latitude }),
      ...(data.longitude !== undefined && { longitude: data.longitude }),
      ...(data.images && {
        images: {
          create: data.images.map((url, index) => ({
            url,
            order: index,
            isPrimary: index === 0,
          })),
        },
      }),
      ...(data.amenities && {
        amenities: {
          create: data.amenities.map(amenity => ({
            amenity: amenity,
          })),
        },
      }),
    },
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: true,
    },
  })
  return transformProperty(property)
}

export async function deleteProperty(id: string): Promise<boolean> {
  try {
    await prisma.property.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

// ============ Favorites Operations ============

export async function getFavoritesByUserId(userId: string): Promise<PropertyWithRelations[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      property: {
        include: {
          images: { orderBy: { order: 'asc' } },
          amenities: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return favorites.map(f => transformProperty(f.property))
}

export async function isFavorite(userId: string, propertyId: string): Promise<boolean> {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  })
  return !!favorite
}

export async function addFavorite(userId: string, propertyId: string) {
  try {
    return await prisma.favorite.create({
      data: { userId, propertyId },
    })
  } catch {
    return null // Already exists
  }
}

export async function removeFavorite(userId: string, propertyId: string): Promise<boolean> {
  try {
    await prisma.favorite.delete({
      where: { userId_propertyId: { userId, propertyId } },
    })
    return true
  } catch {
    return false
  }
}

export async function getAllFavorites() {
  return prisma.favorite.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

// ============ Conversation/Message Operations ============

export async function getOrCreateConversation(
  propertyId: string,
  user1Id: string,
  user2Id: string
) {
  // Sort user IDs to ensure consistent lookup
  const [participant1, participant2] = [user1Id, user2Id].sort()

  let conversation = await prisma.conversation.findFirst({
    where: {
      propertyId,
      participant1,
      participant2,
    },
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        propertyId,
        participant1,
        participant2,
      },
    })
  }

  return conversation
}

export async function getConversationById(conversationId: string) {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
  })
}

export async function getConversationsByUserId(userId: string) {
  return prisma.conversation.findMany({
    where: {
      OR: [{ participant1: userId }, { participant2: userId }],
    },
    orderBy: { lastMessageAt: 'desc' },
  })
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
) {
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
  })

  // Update conversation's lastMessageAt
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  })

  return message
}

export async function getMessagesByConversationId(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  })
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      read: false,
    },
    data: { read: true },
  })
}

// ============ Review Operations ============

export async function getReviewsByPropertyId(propertyId: string) {
  return prisma.review.findMany({
    where: { propertyId, approved: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getReviewById(id: string) {
  return prisma.review.findUnique({ where: { id } })
}

export async function createReview(data: {
  propertyId: string
  userId: string
  rating: number
  comment: string
}) {
  try {
    return await prisma.review.create({ data })
  } catch {
    return null // User already reviewed this property
  }
}

export async function updateReview(id: string, data: { rating?: number; comment?: string }) {
  return prisma.review.update({
    where: { id },
    data,
  })
}

export async function deleteReview(id: string): Promise<boolean> {
  try {
    await prisma.review.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

export async function hasUserReviewedProperty(userId: string, propertyId: string): Promise<boolean> {
  const review = await prisma.review.findUnique({
    where: { propertyId_userId: { propertyId, userId } },
  })
  return !!review
}

export async function getAverageRating(propertyId: string) {
  const result = await prisma.review.aggregate({
    where: { propertyId, approved: true },
    _avg: { rating: true },
    _count: { rating: true },
  })
  return {
    average: result._avg.rating || 0,
    count: result._count.rating,
  }
}

export async function getAllReviews() {
  return prisma.review.findMany({
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  })
}

// ============ Saved Search Operations ============

export async function getSavedSearchesByUserId(userId: string) {
  const searches = await prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return searches.map(s => ({
    ...s,
    filters: JSON.parse(s.filters),
  }))
}

export async function getSavedSearchById(id: string) {
  const search = await prisma.savedSearch.findUnique({ where: { id } })
  if (!search) return null
  return {
    ...search,
    filters: JSON.parse(search.filters),
  }
}

export async function createSavedSearch(data: {
  userId: string
  name: string
  filters: any
  notificationsEnabled?: boolean
}) {
  return prisma.savedSearch.create({
    data: {
      userId: data.userId,
      name: data.name,
      filters: JSON.stringify(data.filters),
      notificationsEnabled: data.notificationsEnabled ?? false,
    },
  })
}

export async function updateSavedSearch(id: string, data: {
  name?: string
  filters?: any
  notificationsEnabled?: boolean
}) {
  return prisma.savedSearch.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.filters && { filters: JSON.stringify(data.filters) }),
      ...(data.notificationsEnabled !== undefined && { notificationsEnabled: data.notificationsEnabled }),
    },
  })
}

export async function deleteSavedSearch(id: string): Promise<boolean> {
  try {
    await prisma.savedSearch.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

// ============ View Tracking ============

export async function incrementPropertyViews(propertyId: string): Promise<void> {
  await prisma.property.update({
    where: { id: propertyId },
    data: { views: { increment: 1 } },
  })
}

export async function getPropertyStats(userId: string) {
  const properties = await prisma.property.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      views: true,
      status: true,
      listingType: true,
      _count: {
        select: {
          favorites: true,
          reviews: true,
        },
      },
    },
  })

  const totalViews = properties.reduce((sum, p) => sum + p.views, 0)
  const totalFavorites = properties.reduce((sum, p) => sum + p._count.favorites, 0)
  const totalInquiries = await prisma.conversation.count({
    where: {
      OR: properties.map(p => ({ propertyId: p.id })),
    },
  })

  return {
    properties,
    totals: {
      properties: properties.length,
      views: totalViews,
      favorites: totalFavorites,
      inquiries: totalInquiries,
      active: properties.filter(p => p.status === 'ACTIVE').length,
      sold: properties.filter(p => p.status === 'SOLD').length,
      rented: properties.filter(p => p.status === 'RENTED').length,
    },
  }
}

// ============ Viewing/Scheduling Operations ============

export async function createViewing(data: {
  propertyId: string
  requesterId: string
  ownerId: string
  date: Date
  time: string
  message?: string
}) {
  return prisma.viewing.create({
    data: {
      propertyId: data.propertyId,
      requesterId: data.requesterId,
      ownerId: data.ownerId,
      date: data.date,
      time: data.time,
      message: data.message,
    },
  })
}

export async function getViewingsByUserId(userId: string) {
  return prisma.viewing.findMany({
    where: {
      OR: [{ requesterId: userId }, { ownerId: userId }],
    },
    orderBy: { date: 'asc' },
  })
}

export async function getViewingsByPropertyId(propertyId: string) {
  return prisma.viewing.findMany({
    where: { propertyId },
    orderBy: { date: 'asc' },
  })
}

export async function updateViewingStatus(id: string, status: string, notes?: string) {
  return prisma.viewing.update({
    where: { id },
    data: {
      status,
      ...(notes && { notes }),
    },
  })
}

export async function getViewingById(id: string) {
  return prisma.viewing.findUnique({ where: { id } })
}

// ============ Recently Viewed Operations ============

export async function addRecentlyViewed(userId: string, propertyId: string) {
  return prisma.recentlyViewed.upsert({
    where: { userId_propertyId: { userId, propertyId } },
    update: { viewedAt: new Date() },
    create: { userId, propertyId },
  })
}

export async function getRecentlyViewed(userId: string, limit = 10): Promise<PropertyWithRelations[]> {
  const recent = await prisma.recentlyViewed.findMany({
    where: { userId },
    orderBy: { viewedAt: 'desc' },
    take: limit,
  })

  const propertyIds = recent.map(r => r.propertyId)

  const properties = await prisma.property.findMany({
    where: { id: { in: propertyIds } },
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: true,
    },
  })

  // Maintain order from recently viewed
  return propertyIds
    .map(id => properties.find(p => p.id === id))
    .filter(Boolean)
    .map(transformProperty) as PropertyWithRelations[]
}

// ============ Helper Functions ============

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// ============ Admin Operations ============

export async function getUserProfile(clerkId: string) {
  return prisma.userProfile.findUnique({ where: { clerkId } })
}

export async function getOrCreateUserProfile(clerkId: string) {
  return prisma.userProfile.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  })
}

export async function updateUserRole(clerkId: string, role: string) {
  return prisma.userProfile.upsert({
    where: { clerkId },
    update: { role },
    create: { clerkId, role },
  })
}

export async function banUser(clerkId: string, reason?: string) {
  return prisma.userProfile.upsert({
    where: { clerkId },
    update: { banned: true, banReason: reason },
    create: { clerkId, banned: true, banReason: reason },
  })
}

export async function unbanUser(clerkId: string) {
  return prisma.userProfile.update({
    where: { clerkId },
    data: { banned: false, banReason: null },
  })
}

export async function isUserAdmin(clerkId: string): Promise<boolean> {
  const profile = await prisma.userProfile.findUnique({ where: { clerkId } })
  return profile?.role === 'ADMIN'
}

export async function isUserBanned(clerkId: string): Promise<boolean> {
  const profile = await prisma.userProfile.findUnique({ where: { clerkId } })
  return profile?.banned ?? false
}

export async function getAllUserProfiles() {
  return prisma.userProfile.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function logAdminAction(data: {
  adminId: string
  action: string
  targetType: string
  targetId: string
  details?: string
}) {
  return prisma.adminLog.create({ data })
}

export async function getAdminLogs(limit = 100) {
  return prisma.adminLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

// Admin stats
export async function getAdminStats() {
  const [
    totalProperties,
    totalReviews,
    pendingReviews,
    totalUsers,
    totalViewings,
    totalMessages,
    recentProperties,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.review.count(),
    prisma.review.count({ where: { approved: false } }),
    prisma.userProfile.count(),
    prisma.viewing.count(),
    prisma.message.count(),
    prisma.property.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ])

  return {
    totalProperties,
    totalReviews,
    pendingReviews,
    totalUsers,
    totalViewings,
    totalMessages,
    recentProperties,
  }
}

// Get all properties with user info (for admin)
export async function getAdminProperties(filters?: {
  status?: string
  search?: string
}) {
  return prisma.property.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && {
        OR: [
          { title: { contains: filters.search } },
          { city: { contains: filters.search } },
          { address: { contains: filters.search } },
        ],
      }),
    },
    include: {
      images: { take: 1, orderBy: { order: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Get all reviews (for admin moderation)
export async function getAdminReviews(filters?: { approved?: boolean }) {
  return prisma.review.findMany({
    where: filters?.approved !== undefined ? { approved: filters.approved } : {},
    orderBy: { createdAt: 'desc' },
  })
}

export async function approveReview(id: string) {
  return prisma.review.update({
    where: { id },
    data: { approved: true },
  })
}

export async function rejectReview(id: string) {
  return prisma.review.delete({ where: { id } })
}

// Delete property (admin action)
export async function adminDeleteProperty(id: string) {
  return prisma.property.delete({ where: { id } })
}

// ============ Social Proof Operations ============

export async function getPropertySocialProof(propertyId: string) {
  const [conversationCount, favoriteCount] = await Promise.all([
    prisma.conversation.count({ where: { propertyId } }),
    prisma.favorite.count({ where: { propertyId } }),
  ])

  return {
    inquiryCount: conversationCount,
    favoriteCount,
  }
}
