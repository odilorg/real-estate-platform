import { mockProperties } from './mockData'

export interface Property {
  id: string
  title: string
  description: string
  propertyType: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL' | 'VILLA' | 'STUDIO'
  listingType: 'SALE' | 'RENT'
  price: number
  address: string
  city: string
  state?: string
  country: string
  zipCode?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  yearBuilt?: number
  floor?: number
  totalFloors?: number
  parking?: number
  images: string[]
  amenities: string[]
  userId?: string
  createdAt: Date
  updatedAt?: Date
}

export interface Favorite {
  id: string
  userId: string
  propertyId: string
  createdAt: Date
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: Date
  read: boolean
}

export interface Conversation {
  id: string
  propertyId: string
  participants: string[] // Array of user IDs [buyer, seller]
  lastMessageAt: Date
  createdAt: Date
}

// In-memory data store
class DataStore {
  private properties: Property[] = []
  private favorites: Favorite[] = []
  private conversations: Conversation[] = []
  private messages: Message[] = []
  private nextPropertyId: number = 1
  private nextFavoriteId: number = 1
  private nextConversationId: number = 1
  private nextMessageId: number = 1

  constructor() {
    // Initialize with mock data
    this.properties = mockProperties.map(p => ({
      ...p,
      updatedAt: p.createdAt,
    }))
    this.nextPropertyId = this.properties.length + 1
  }

  // Property CRUD operations
  getAllProperties(): Property[] {
    return [...this.properties]
  }

  getPropertyById(id: string): Property | null {
    return this.properties.find(p => p.id === id) || null
  }

  getPropertiesByUserId(userId: string): Property[] {
    return this.properties.filter(p => p.userId === userId)
  }

  searchProperties(filters: {
    query?: string
    propertyType?: string
    listingType?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    bathrooms?: number
    city?: string
    amenities?: string[]
  }): Property[] {
    let results = [...this.properties]

    // Filter by search query (title, description, address, city)
    if (filters.query) {
      const query = filters.query.toLowerCase()
      results = results.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query)
      )
    }

    // Filter by property type
    if (filters.propertyType) {
      results = results.filter(p => p.propertyType === filters.propertyType)
    }

    // Filter by listing type
    if (filters.listingType) {
      results = results.filter(p => p.listingType === filters.listingType)
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice!)
    }

    // Filter by bedrooms
    if (filters.bedrooms !== undefined) {
      results = results.filter(p => p.bedrooms === filters.bedrooms)
    }

    // Filter by bathrooms
    if (filters.bathrooms !== undefined) {
      results = results.filter(p => p.bathrooms && p.bathrooms >= filters.bathrooms!)
    }

    // Filter by city
    if (filters.city) {
      results = results.filter(p => p.city.toLowerCase() === filters.city!.toLowerCase())
    }

    // Filter by amenities (property must have all requested amenities)
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter(p =>
        filters.amenities!.every(amenity => p.amenities.includes(amenity))
      )
    }

    return results
  }

  createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property {
    const newProperty: Property = {
      ...propertyData,
      id: String(this.nextPropertyId++),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.properties.push(newProperty)
    return newProperty
  }

  updateProperty(id: string, updates: Partial<Omit<Property, 'id' | 'createdAt'>>): Property | null {
    const index = this.properties.findIndex(p => p.id === id)
    if (index === -1) return null

    this.properties[index] = {
      ...this.properties[index],
      ...updates,
      updatedAt: new Date(),
    }
    return this.properties[index]
  }

  deleteProperty(id: string): boolean {
    const index = this.properties.findIndex(p => p.id === id)
    if (index === -1) return false

    this.properties.splice(index, 1)
    // Also remove associated favorites
    this.favorites = this.favorites.filter(f => f.propertyId !== id)
    return true
  }

  // Favorites operations
  getAllFavorites(): Favorite[] {
    return [...this.favorites]
  }

  getAllFavoritesByUserId(userId: string): Favorite[] {
    return this.favorites.filter(f => f.userId === userId)
  }

  getFavoritePropertiesByUserId(userId: string): Property[] {
    const userFavorites = this.favorites.filter(f => f.userId === userId)
    return userFavorites
      .map(f => this.getPropertyById(f.propertyId))
      .filter(p => p !== null) as Property[]
  }

  isFavorite(userId: string, propertyId: string): boolean {
    return this.favorites.some(f => f.userId === userId && f.propertyId === propertyId)
  }

  addFavorite(userId: string, propertyId: string): Favorite | null {
    // Check if property exists
    if (!this.getPropertyById(propertyId)) {
      return null
    }

    // Check if already favorited
    if (this.isFavorite(userId, propertyId)) {
      return null
    }

    const newFavorite: Favorite = {
      id: String(this.nextFavoriteId++),
      userId,
      propertyId,
      createdAt: new Date(),
    }
    this.favorites.push(newFavorite)
    return newFavorite
  }

  removeFavorite(userId: string, propertyId: string): boolean {
    const index = this.favorites.findIndex(
      f => f.userId === userId && f.propertyId === propertyId
    )
    if (index === -1) return false

    this.favorites.splice(index, 1)
    return true
  }

  // Messaging operations
  getOrCreateConversation(propertyId: string, user1Id: string, user2Id: string): Conversation {
    // Check if conversation already exists between these users for this property
    const existing = this.conversations.find(
      c => c.propertyId === propertyId &&
      c.participants.includes(user1Id) &&
      c.participants.includes(user2Id)
    )

    if (existing) {
      return existing
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: String(this.nextConversationId++),
      propertyId,
      participants: [user1Id, user2Id],
      lastMessageAt: new Date(),
      createdAt: new Date(),
    }
    this.conversations.push(newConversation)
    return newConversation
  }

  getConversationById(conversationId: string): Conversation | null {
    return this.conversations.find(c => c.id === conversationId) || null
  }

  getConversationsByUserId(userId: string): Conversation[] {
    return this.conversations
      .filter(c => c.participants.includes(userId))
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
  }

  sendMessage(conversationId: string, senderId: string, content: string): Message | null {
    const conversation = this.getConversationById(conversationId)
    if (!conversation) return null

    // Verify sender is a participant
    if (!conversation.participants.includes(senderId)) return null

    const newMessage: Message = {
      id: String(this.nextMessageId++),
      conversationId,
      senderId,
      content,
      createdAt: new Date(),
      read: false,
    }
    this.messages.push(newMessage)

    // Update conversation's lastMessageAt
    conversation.lastMessageAt = new Date()

    return newMessage
  }

  getMessagesByConversationId(conversationId: string): Message[] {
    return this.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  markMessagesAsRead(conversationId: string, userId: string): void {
    this.messages
      .filter(m => m.conversationId === conversationId && m.senderId !== userId && !m.read)
      .forEach(m => m.read = true)
  }

  getUnreadCount(userId: string): number {
    const userConversations = this.getConversationsByUserId(userId)
    const conversationIds = userConversations.map(c => c.id)

    return this.messages.filter(
      m => conversationIds.includes(m.conversationId) &&
      m.senderId !== userId &&
      !m.read
    ).length
  }
}

// Singleton instance
let dataStore: DataStore | null = null

export function getDataStore(): DataStore {
  if (!dataStore) {
    dataStore = new DataStore()
  }
  return dataStore
}
