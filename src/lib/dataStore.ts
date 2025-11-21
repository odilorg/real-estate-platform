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

// In-memory data store
class DataStore {
  private properties: Property[] = []
  private favorites: Favorite[] = []
  private nextPropertyId: number = 1
  private nextFavoriteId: number = 1

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
}

// Singleton instance
let dataStore: DataStore | null = null

export function getDataStore(): DataStore {
  if (!dataStore) {
    dataStore = new DataStore()
  }
  return dataStore
}
