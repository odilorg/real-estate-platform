// Shared type definitions for the real estate platform

// Agent/Seller info for property cards
export interface PropertyAgent {
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

export interface Property {
  id: string
  userId: string
  title: string
  description: string
  price: number
  propertyType: string
  listingType: string
  status: string
  // Location details
  address: string
  city: string
  state: string | null
  country: string
  zipCode: string | null
  latitude: number | null
  longitude: number | null
  district: string | null
  nearestMetro: string | null
  metroDistance: number | null
  // Property details - Areas
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  livingArea: number | null
  kitchenArea: number | null
  rooms: number | null
  // Property details - Building info
  yearBuilt: number | null
  floor: number | null
  totalFloors: number | null
  ceilingHeight: number | null
  // Property details - Features
  parking: number | null
  parkingType: string | null
  balcony: number | null
  loggia: number | null
  // Building characteristics
  buildingType: string | null
  buildingClass: string | null
  buildingName: string | null
  elevatorPassenger: number | null
  elevatorCargo: number | null
  hasGarbageChute: boolean
  hasConcierge: boolean
  hasGatedArea: boolean
  // Apartment condition
  renovation: string | null
  windowView: string | null
  bathroomType: string | null
  furnished: string | null
  // Metadata
  views: number
  featured: boolean
  verified: boolean
  createdAt: Date
  updatedAt: Date
  images: string[]
  amenities: string[]
  agent?: PropertyAgent | null
}

export interface Review {
  id: string
  propertyId: string
  userId: string
  rating: number
  comment: string
  approved: boolean
  createdAt: Date
  updatedAt: Date
  user?: {
    id: string
    name: string
    imageUrl: string
  }
}

export interface Conversation {
  id: string
  propertyId: string
  participant1: string
  participant2: string
  participants: string[]
  lastMessageAt: Date
  createdAt: Date
  property?: {
    id: string
    title: string
    images: string[]
    price: number
  } | null
  otherParticipant?: {
    id: string
    name: string
    email: string
    imageUrl: string
  } | null
  lastMessage?: {
    content: string
    createdAt: Date
    senderId: string
  } | null
  unreadCount: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  read: boolean
  createdAt: Date
  sender?: {
    id: string
    name: string
    imageUrl: string
  }
}

export interface SavedSearch {
  id: string
  userId: string
  name: string
  filters: Record<string, any>
  notificationsEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Favorite {
  id: string
  userId: string
  propertyId: string
  createdAt: Date
}

// API Response types
export interface SearchResponse {
  properties: Property[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  filters: Record<string, any>
}

export interface ReviewsResponse {
  reviews: Review[]
  averageRating: number
  reviewCount: number
}

// Property type constants
export const PROPERTY_TYPES = [
  'APARTMENT',
  'HOUSE',
  'CONDO',
  'TOWNHOUSE',
  'LAND',
  'COMMERCIAL',
  'VILLA',
  'STUDIO',
] as const

export const LISTING_TYPES = ['SALE', 'RENT'] as const

export const PROPERTY_STATUS = [
  'ACTIVE',
  'PENDING',
  'SOLD',
  'RENTED',
  'INACTIVE',
] as const

export const AMENITIES = [
  'PARKING',
  'GARAGE',
  'POOL',
  'GARDEN',
  'BALCONY',
  'ELEVATOR',
  'SECURITY',
  'GYM',
  'AIR_CONDITIONING',
  'HEATING',
  'FURNISHED',
  'PET_FRIENDLY',
  'INTERNET',
  'DISHWASHER',
  'WASHING_MACHINE',
  'FIREPLACE',
  'STORAGE',
] as const

export type PropertyType = typeof PROPERTY_TYPES[number]
export type ListingType = typeof LISTING_TYPES[number]
export type PropertyStatus = typeof PROPERTY_STATUS[number]
export type Amenity = typeof AMENITIES[number]
