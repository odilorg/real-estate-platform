import { prisma } from './prisma'
import type { Prisma } from '@prisma/client'

type PropertyType = string
type ListingType = string

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

interface PropertyCity {
  id: string
  slug: string
  nameEn: string
  nameRu: string
  nameUz: string
  region?: {
    id: string
    slug: string
    nameEn: string
    nameRu: string
    nameUz: string
  } | null
}

interface PropertyDistrict {
  id: string
  slug: string
  nameEn: string
  nameRu: string
  nameUz: string
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
  cityId: string | null
  districtId: string | null
  state: string | null
  country: string
  zipCode: string | null
  latitude: number | null
  longitude: number | null
  nearestMetro: string | null
  metroDistance: number | null
  city?: PropertyCity | null
  district?: PropertyDistrict | null
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  livingArea: number | null
  kitchenArea: number | null
  rooms: number | null
  yearBuilt: number | null
  floor: number | null
  totalFloors: number | null
  ceilingHeight: number | null
  parking: number | null
  parkingType: string | null
  balcony: number | null
  loggia: number | null
  buildingType: string | null
  buildingClass: string | null
  buildingName: string | null
  elevatorPassenger: number | null
  elevatorCargo: number | null
  hasGarbageChute: boolean
  hasConcierge: boolean
  hasGatedArea: boolean
  renovation: string | null
  windowView: string | null
  bathroomType: string | null
  furnished: string | null
  views: number
  featured: boolean
  verified: boolean
  createdAt: Date
  updatedAt: Date
  images: string[]
  amenities: string[]
  agent?: PropertyAgent | null
}

const propertyInclude = {
  images: { orderBy: { order: 'asc' } as const },
  amenities: true,
  City: { include: { Region: true } },
  District: true,
}

function transformProperty(property: any): PropertyWithRelations {
  return {
    ...property,
    images: property.images?.map((img: any) => img.url) || [],
    amenities: property.amenities?.map((a: any) => a.amenity) || [],
    city: property.City ? {
      id: property.City.id,
      slug: property.City.slug,
      nameEn: property.City.nameEn,
      nameRu: property.City.nameRu,
      nameUz: property.City.nameUz,
      region: property.City.Region ? {
        id: property.City.Region.id,
        slug: property.City.Region.slug,
        nameEn: property.City.Region.nameEn,
        nameRu: property.City.Region.nameRu,
        nameUz: property.City.Region.nameUz,
      } : null,
    } : null,
    district: property.District ? {
      id: property.District.id,
      slug: property.District.slug,
      nameEn: property.District.nameEn,
      nameRu: property.District.nameRu,
      nameUz: property.District.nameUz,
    } : null,
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
    include: propertyInclude,
    orderBy: { createdAt: 'desc' },
  })
  return properties.map(transformProperty)
}

export async function getPropertyById(id: string): Promise<PropertyWithRelations | null> {
  const property = await prisma.property.findUnique({
    where: { id },
    include: propertyInclude,
  })
  return property ? transformProperty(property) : null
}

export async function getPropertiesByUserId(userId: string): Promise<PropertyWithRelations[]> {
  const properties = await prisma.property.findMany({
    where: { userId },
    include: propertyInclude,
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
  cityId?: string
  districtId?: string
  state?: string
  amenities?: string[]
  latitude?: number
  longitude?: number
  radius?: number
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
  const where: Prisma.PropertyWhereInput = { status: 'ACTIVE' }
  const searchQuery = filters.query?.toLowerCase()

  if (filters.propertyType) where.propertyType = filters.propertyType
  if (filters.propertyTypes?.length) where.propertyType = { in: filters.propertyTypes }
  if (filters.listingType) where.listingType = filters.listingType
  if (filters.listingTypes?.length) where.listingType = { in: filters.listingTypes }
  if (filters.minPrice !== undefined) where.price = { ...where.price as any, gte: filters.minPrice }
  if (filters.maxPrice !== undefined) where.price = { ...where.price as any, lte: filters.maxPrice }
  if (filters.minBedrooms && filters.minBedrooms > 0) where.bedrooms = { ...where.bedrooms as any, gte: filters.minBedrooms }
  if (filters.maxBedrooms && filters.maxBedrooms > 0) where.bedrooms = { ...where.bedrooms as any, lte: filters.maxBedrooms }
  if (filters.minBathrooms && filters.minBathrooms > 0) where.bathrooms = { ...where.bathrooms as any, gte: filters.minBathrooms }
  if (filters.maxBathrooms && filters.maxBathrooms > 0) where.bathrooms = { ...where.bathrooms as any, lte: filters.maxBathrooms }
  if (filters.minArea !== undefined) where.area = { ...where.area as any, gte: filters.minArea }
  if (filters.maxArea !== undefined) where.area = { ...where.area as any, lte: filters.maxArea }
  if (filters.cityId) where.cityId = filters.cityId
  if (filters.districtId) where.districtId = filters.districtId
  if (filters.state) where.state = { contains: filters.state }
  if (filters.buildingClasses?.length) where.buildingClass = { in: filters.buildingClasses }
  if (filters.renovationTypes?.length) where.renovation = { in: filters.renovationTypes }
  if (filters.parkingTypes?.length) where.parkingType = { in: filters.parkingTypes }
  if (filters.maxMetroDistance !== undefined) where.metroDistance = { lte: filters.maxMetroDistance }
  if (filters.minYearBuilt !== undefined) where.yearBuilt = { ...where.yearBuilt as any, gte: filters.minYearBuilt }
  if (filters.maxYearBuilt !== undefined) where.yearBuilt = { ...where.yearBuilt as any, lte: filters.maxYearBuilt }
  if (filters.minFloor !== undefined) where.floor = { ...where.floor as any, gte: filters.minFloor }
  if (filters.maxFloor !== undefined) where.floor = { ...where.floor as any, lte: filters.maxFloor }
  if (filters.hasBalcony === true) where.balcony = { gt: 0 }
  if (filters.hasConcierge === true) where.hasConcierge = true
  if (filters.hasGatedArea === true) where.hasGatedArea = true

  const properties = await prisma.property.findMany({
    where,
    include: propertyInclude,
    orderBy: { createdAt: 'desc' },
  })

  let results = properties.map(transformProperty)

  if (searchQuery) {
    results = results.filter(p => {
      const cityMatch = p.city ? (
        p.city.nameEn.toLowerCase().includes(searchQuery) ||
        p.city.nameRu.toLowerCase().includes(searchQuery) ||
        p.city.nameUz.toLowerCase().includes(searchQuery)
      ) : false
      const districtMatch = p.district ? (
        p.district.nameEn.toLowerCase().includes(searchQuery) ||
        p.district.nameRu.toLowerCase().includes(searchQuery) ||
        p.district.nameUz.toLowerCase().includes(searchQuery)
      ) : false
      const regionMatch = p.city?.region ? (
        p.city?.Region.nameEn.toLowerCase().includes(searchQuery) ||
        p.city?.Region.nameRu.toLowerCase().includes(searchQuery) ||
        p.city?.Region.nameUz.toLowerCase().includes(searchQuery)
      ) : false
      return p.title.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.address.toLowerCase().includes(searchQuery) ||
        cityMatch || districtMatch || regionMatch
    })
  }

  if (filters.amenities?.length) {
    results = results.filter(p => filters.amenities!.every(a => p.amenities.includes(a)))
  }

  if (filters.minPricePerSqFt !== undefined || filters.maxPricePerSqFt !== undefined) {
    results = results.filter(p => {
      if (!p.area || p.area === 0) return false
      const pricePerSqFt = p.price / p.area
      if (filters.minPricePerSqFt !== undefined && pricePerSqFt < filters.minPricePerSqFt) return false
      if (filters.maxPricePerSqFt !== undefined && pricePerSqFt > filters.maxPricePerSqFt) return false
      return true
    })
  }

  const agentMap = await fetchAgentsForProperties(properties)
  return results.map(p => ({ ...p, agent: agentMap.get(p.userId) || null }))
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
  cityId?: string
  districtId?: string
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
      cityId: data.cityId,
      districtId: data.districtId,
      state: data.state,
      country: data.country || 'Uzbekistan',
      zipCode: data.zipCode,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area: data.area,
      yearBuilt: data.yearBuilt,
      floor: data.floor,
      totalFloors: data.totalFloors,
      parking: data.parking,
      latitude: data.latitude,
      images: { create: data.images.map((url, i) => ({ url, order: i, isPrimary: i === 0 })) },
      amenities: { create: (data.amenities || []).map(a => ({ amenity: a })) },
    },
    include: propertyInclude,
  })
  return transformProperty(property)
}

export async function updateProperty(id: string, data: Partial<CreatePropertyData>): Promise<PropertyWithRelations | null> {
  if (data.images) await prisma.propertyImage.deleteMany({ where: { propertyId: id } })
  if (data.amenities) await prisma.propertyAmenity.deleteMany({ where: { propertyId: id } })

  if (data.price !== undefined) {
    const current = await prisma.property.findUnique({ where: { id }, select: { price: true } })
    if (current && current.price !== data.price) {
      await prisma.priceHistory.create({
        data: { propertyId: id, price: data.price, changeType: data.price > current.price ? 'INCREASE' : 'DECREASE' },
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
      ...(data.cityId !== undefined && { cityId: data.cityId }),
      ...(data.districtId !== undefined && { districtId: data.districtId }),
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
      ...(data.images && { images: { create: data.images.map((url, i) => ({ url, order: i, isPrimary: i === 0 })) } }),
      ...(data.amenities && { amenities: { create: data.amenities.map(a => ({ amenity: a })) } }),
    },
    include: propertyInclude,
  })
  return transformProperty(property)
}

export async function deleteProperty(id: string): Promise<boolean> {
  try { await prisma.property.delete({ where: { id } }); return true } catch { return false }
}

export async function getFavoritesByUserId(userId: string): Promise<PropertyWithRelations[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { property: { include: propertyInclude } },
    orderBy: { createdAt: 'desc' },
  })
  return favorites.map(f => transformProperty(f.property))
}

export async function isFavorite(userId: string, propertyId: string): Promise<boolean> {
  const fav = await prisma.favorite.findUnique({ where: { userId_propertyId: { userId, propertyId } } })
  return !!fav
}

export async function addFavorite(userId: string, propertyId: string) {
  try { return await prisma.favorite.create({ data: { userId, propertyId } }) } catch { return null }
}

export async function removeFavorite(userId: string, propertyId: string): Promise<boolean> {
  try { await prisma.favorite.delete({ where: { userId_propertyId: { userId, propertyId } } }); return true } catch { return false }
}

export async function getAllFavorites() {
  return prisma.favorite.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getOrCreateConversation(propertyId: string, user1Id: string, user2Id: string) {
  const [participant1, participant2] = [user1Id, user2Id].sort()
  let conv = await prisma.conversation.findFirst({ where: { propertyId, participant1, participant2 } })
  if (!conv) conv = await prisma.conversation.create({ data: { propertyId, participant1, participant2 } })
  return conv
}

export async function getConversationById(id: string) { return prisma.conversation.findUnique({ where: { id } }) }
export async function getConversationsByUserId(userId: string) {
  return prisma.conversation.findMany({ where: { OR: [{ participant1: userId }, { participant2: userId }] }, orderBy: { lastMessageAt: 'desc' } })
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  const msg = await prisma.message.create({ data: { conversationId, senderId, content } })
  await prisma.conversation.update({ where: { id: conversationId }, data: { lastMessageAt: new Date() } })
  return msg
}

export async function getMessagesByConversationId(id: string) {
  return prisma.message.findMany({ where: { conversationId: id }, orderBy: { createdAt: 'asc' } })
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  await prisma.message.updateMany({ where: { conversationId, senderId: { not: userId }, read: false }, data: { read: true } })
}

export async function getReviewsByPropertyId(propertyId: string) {
  return prisma.review.findMany({ where: { propertyId, approved: true }, orderBy: { createdAt: 'desc' } })
}
export async function getReviewById(id: string) { return prisma.review.findUnique({ where: { id } }) }
export async function createReview(data: { propertyId: string; userId: string; rating: number; comment: string }) {
  try { return await prisma.review.create({ data }) } catch { return null }
}
export async function updateReview(id: string, data: { rating?: number; comment?: string }) {
  return prisma.review.update({ where: { id }, data })
}
export async function deleteReview(id: string): Promise<boolean> {
  try { await prisma.review.delete({ where: { id } }); return true } catch { return false }
}
export async function hasUserReviewedProperty(userId: string, propertyId: string): Promise<boolean> {
  const r = await prisma.review.findUnique({ where: { propertyId_userId: { propertyId, userId } } })
  return !!r
}
export async function getAverageRating(propertyId: string) {
  const r = await prisma.review.aggregate({ where: { propertyId, approved: true }, _avg: { rating: true }, _count: { rating: true } })
  return { average: r._avg.rating || 0, count: r._count.rating }
}
export async function getAllReviews() {
  return prisma.review.findMany({ include: { property: true }, orderBy: { createdAt: 'desc' } })
}

export async function getSavedSearchesByUserId(userId: string) {
  const s = await prisma.savedSearch.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  return s.map(x => ({ ...x, filters: JSON.parse(x.filters) }))
}
export async function getSavedSearchById(id: string) {
  const s = await prisma.savedSearch.findUnique({ where: { id } })
  return s ? { ...s, filters: JSON.parse(s.filters) } : null
}
export async function createSavedSearch(data: { userId: string; name: string; filters: any; notificationsEnabled?: boolean }) {
  return prisma.savedSearch.create({ data: { userId: data.userId, name: data.name, filters: JSON.stringify(data.filters), notificationsEnabled: data.notificationsEnabled ?? false } })
}
export async function updateSavedSearch(id: string, data: { name?: string; filters?: any; notificationsEnabled?: boolean }) {
  return prisma.savedSearch.update({ where: { id }, data: { ...(data.name && { name: data.name }), ...(data.filters && { filters: JSON.stringify(data.filters) }), ...(data.notificationsEnabled !== undefined && { notificationsEnabled: data.notificationsEnabled }) } })
}
export async function deleteSavedSearch(id: string): Promise<boolean> {
  try { await prisma.savedSearch.delete({ where: { id } }); return true } catch { return false }
}

export async function incrementPropertyViews(propertyId: string): Promise<void> {
  await prisma.property.update({ where: { id: propertyId }, data: { views: { increment: 1 } } })
}

export async function getPropertyStats(userId: string) {
  const props = await prisma.property.findMany({
    where: { userId },
    select: { id: true, title: true, views: true, status: true, listingType: true, _count: { select: { favorites: true, reviews: true } } }
  })
  const totalViews = props.reduce((s, p) => s + p.views, 0)
  const totalFavorites = props.reduce((s, p) => s + p._count.favorites, 0)
  const totalInquiries = await prisma.conversation.count({ where: { OR: props.map(p => ({ propertyId: p.id })) } })
  return {
    properties: props,
    totals: { properties: props.length, views: totalViews, favorites: totalFavorites, inquiries: totalInquiries, active: props.filter(p => p.status === 'ACTIVE').length, sold: props.filter(p => p.status === 'SOLD').length, rented: props.filter(p => p.status === 'RENTED').length }
  }
}

export async function createViewing(data: { propertyId: string; requesterId: string; ownerId: string; date: Date; time: string; message?: string }) {
  return prisma.viewing.create({ data: { propertyId: data.propertyId, requesterId: data.requesterId, ownerId: data.ownerId, date: data.date, time: data.time, message: data.message } })
}
export async function getViewingsByUserId(userId: string) {
  return prisma.viewing.findMany({ where: { OR: [{ requesterId: userId }, { ownerId: userId }] }, orderBy: { date: 'asc' } })
}
export async function getViewingsByPropertyId(propertyId: string) {
  return prisma.viewing.findMany({ where: { propertyId }, orderBy: { date: 'asc' } })
}
export async function updateViewingStatus(id: string, status: string, notes?: string) {
  return prisma.viewing.update({ where: { id }, data: { status, ...(notes && { notes }) } })
}
export async function getViewingById(id: string) { return prisma.viewing.findUnique({ where: { id } }) }

export async function addRecentlyViewed(userId: string, propertyId: string) {
  return prisma.recentlyViewed.upsert({ where: { userId_propertyId: { userId, propertyId } }, update: { viewedAt: new Date() }, create: { userId, propertyId } })
}

export async function getRecentlyViewed(userId: string, limit = 10): Promise<PropertyWithRelations[]> {
  const recent = await prisma.recentlyViewed.findMany({ where: { userId }, orderBy: { viewedAt: 'desc' }, take: limit })
  const ids = recent.map(r => r.propertyId)
  const props = await prisma.property.findMany({ where: { id: { in: ids } }, include: propertyInclude })
  return ids.map(id => props.find(p => p.id === id)).filter(Boolean).map(transformProperty) as PropertyWithRelations[]
}

export async function getUserById(userId: string) { return prisma.user.findUnique({ where: { id: userId } }) }
export async function updateUserRole(userId: string, role: string) { return prisma.user.update({ where: { id: userId }, data: { role } }) }
export async function banUser(userId: string, reason?: string) { return prisma.user.update({ where: { id: userId }, data: { banned: true, banReason: reason } }) }
export async function unbanUser(userId: string) { return prisma.user.update({ where: { id: userId }, data: { banned: false, banReason: null } }) }
export async function isUserAdmin(userId: string): Promise<boolean> { const u = await prisma.user.findUnique({ where: { id: userId } }); return u?.role === 'ADMIN' }
export async function isUserBanned(userId: string): Promise<boolean> { const u = await prisma.user.findUnique({ where: { id: userId } }); return u?.banned ?? false }
export async function getAllUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, emailVerified: true, image: true, role: true, banned: true, banReason: true, createdAt: true } })
}
export async function getUserCount() { return prisma.user.count() }
export async function logAdminAction(data: { adminId: string; action: string; targetType: string; targetId: string; details?: string }) {
  return prisma.adminLog.create({ data })
}
export async function getAdminLogs(limit = 100) { return prisma.adminLog.findMany({ orderBy: { createdAt: 'desc' }, take: limit }) }

export async function getAdminStats() {
  const [totalProperties, totalReviews, pendingReviews, totalUsers, totalViewings, totalMessages, recentProperties] = await Promise.all([
    prisma.property.count(),
    prisma.review.count(),
    prisma.review.count({ where: { approved: false } }),
    prisma.user.count(),
    prisma.viewing.count(),
    prisma.message.count(),
    prisma.property.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
  ])
  return { totalProperties, totalReviews, pendingReviews, totalUsers, totalViewings, totalMessages, recentProperties }
}

export async function getAdminProperties(filters?: { status?: string; search?: string }) {
  const props = await prisma.property.findMany({
    where: { ...(filters?.status && { status: filters.status }) },
    include: { images: { take: 1, orderBy: { order: 'asc' } }, City: true },
    orderBy: { createdAt: 'desc' },
  })
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    return props.filter(p => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) ||
      (p.City && (p.City.nameEn.toLowerCase().includes(q) || p.City.nameRu.toLowerCase().includes(q) || p.City.nameUz.toLowerCase().includes(q))))
  }
  return props
}

export async function getAdminReviews(filters?: { approved?: boolean }) {
  return prisma.review.findMany({ where: filters?.approved !== undefined ? { approved: filters.approved } : {}, orderBy: { createdAt: 'desc' } })
}
export async function approveReview(id: string) { return prisma.review.update({ where: { id }, data: { approved: true } }) }
export async function rejectReview(id: string) { return prisma.review.delete({ where: { id } }) }
export async function adminDeleteProperty(id: string) { return prisma.property.delete({ where: { id } }) }

export async function getPropertySocialProof(propertyId: string) {
  const [convs, favs] = await Promise.all([
    prisma.conversation.count({ where: { propertyId } }),
    prisma.favorite.count({ where: { propertyId } }),
  ])
  return { inquiryCount: convs, favoriteCount: favs }
}

export async function getAllRegions() {
  return prisma.region.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, include: { cities: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } } })
}
export async function getCitiesByRegion(regionId: string) {
  return prisma.city.findMany({ where: { regionId, isActive: true }, orderBy: { sortOrder: 'asc' }, include: { districts: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } } })
}
export async function getDistrictsByCity(cityId: string) {
  return prisma.district.findMany({ where: { cityId, isActive: true }, orderBy: { sortOrder: 'asc' } })
}
export async function getCityBySlug(slug: string) {
  return prisma.city.findUnique({ where: { slug }, include: { region: true, districts: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } } })
}
export async function getRegionBySlug(slug: string) {
  return prisma.region.findUnique({ where: { slug }, include: { cities: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } } })
}
