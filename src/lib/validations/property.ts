import { z } from 'zod'

// Enum definitions for type safety
export const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'VILLA', 'STUDIO'] as const
export const LISTING_TYPES = ['SALE', 'RENT'] as const
export const STATUS_TYPES = ['ACTIVE', 'PENDING', 'SOLD', 'RENTED', 'DRAFT'] as const
export const BUILDING_TYPES = ['BRICK', 'PANEL', 'MONOLITHIC', 'WOOD', 'BLOCK'] as const
export const BUILDING_CLASSES = ['ECONOMY', 'COMFORT', 'BUSINESS', 'ELITE'] as const
export const PARKING_TYPES = ['STREET', 'UNDERGROUND', 'GARAGE', 'MULTI_LEVEL'] as const
export const RENOVATION_TYPES = ['NONE', 'COSMETIC', 'EURO', 'DESIGNER', 'NEEDS_REPAIR'] as const
export const WINDOW_VIEWS = ['COURTYARD', 'STREET', 'PARK', 'WATER', 'PANORAMIC'] as const
export const BATHROOM_TYPES = ['COMBINED', 'SEPARATE', 'MULTIPLE'] as const
export const FURNISHED_TYPES = ['NONE', 'PARTIAL', 'FULL'] as const

// Helper to handle empty number inputs (converts NaN and empty strings to undefined)
const optionalNumber = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val))) {
      return undefined
    }
    return typeof val === 'string' ? parseFloat(val) : val
  },
  z.number().optional()
)

const optionalPositiveNumber = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val))) {
      return undefined
    }
    return typeof val === 'string' ? parseFloat(val) : val
  },
  z.number().positive('Must be a positive number').optional()
)

const optionalNonNegativeInt = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val))) {
      return undefined
    }
    return typeof val === 'string' ? parseInt(val, 10) : val
  },
  z.number().int('Must be a whole number').min(0, 'Cannot be negative').optional()
)

export const propertySchema = z.object({
  // Basic Information
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  propertyType: z.enum(PROPERTY_TYPES),
  listingType: z.enum(LISTING_TYPES),
  status: z.enum(STATUS_TYPES).optional(),
  price: z.number().positive('Price must be positive'),

  // Location
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  latitude: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val))) ? undefined : val,
    z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90').optional()
  ),
  longitude: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val))) ? undefined : val,
    z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180').optional()
  ),
  district: z.string().optional(),
  nearestMetro: z.string().optional(),
  metroDistance: optionalNonNegativeInt,

  // Property Details - Areas
  bedrooms: optionalNonNegativeInt,
  bathrooms: optionalPositiveNumber,
  area: optionalPositiveNumber,
  livingArea: optionalPositiveNumber,
  kitchenArea: optionalPositiveNumber,
  rooms: optionalNonNegativeInt,

  // Property Details - Building info
  yearBuilt: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val))) ? undefined : val,
    z.number().int('Year must be a whole number').min(1800, 'Year must be after 1800').max(new Date().getFullYear() + 1, 'Invalid year').optional()
  ),
  floor: optionalNonNegativeInt,
  totalFloors: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val))) ? undefined : val,
    z.number().int('Must be a whole number').min(1, 'Building must have at least 1 floor').optional()
  ),
  ceilingHeight: optionalPositiveNumber,

  // Property Details - Features
  parking: optionalNonNegativeInt,
  parkingType: z.enum(PARKING_TYPES).optional(),
  balcony: optionalNonNegativeInt,
  loggia: optionalNonNegativeInt,

  // Building characteristics
  buildingType: z.enum(BUILDING_TYPES).optional(),
  buildingClass: z.enum(BUILDING_CLASSES).optional(),
  buildingName: z.string().optional(),
  elevatorPassenger: optionalNonNegativeInt,
  elevatorCargo: optionalNonNegativeInt,
  hasGarbageChute: z.boolean().optional(),
  hasConcierge: z.boolean().optional(),
  hasGatedArea: z.boolean().optional(),

  // Apartment condition
  renovation: z.enum(RENOVATION_TYPES).optional(),
  windowView: z.enum(WINDOW_VIEWS).optional(),
  bathroomType: z.enum(BATHROOM_TYPES).optional(),
  furnished: z.enum(FURNISHED_TYPES).optional(),

  // Images - will be handled separately
  images: z.array(z.string()).min(1, 'At least one image is required').max(20),

  // Amenities
  amenities: z.array(z.string()).optional(),
})

export type PropertyFormData = z.infer<typeof propertySchema>

// Step-by-step schemas for multi-step form
export const stepOneSchema = propertySchema.pick({
  title: true,
  propertyType: true,
  listingType: true,
  price: true,
  buildingName: true,
  buildingClass: true,
})

export const stepTwoSchema = propertySchema.pick({
  address: true,
  city: true,
  state: true,
  zipCode: true,
  district: true,
  latitude: true,
  longitude: true,
  nearestMetro: true,
  metroDistance: true,
})

export const stepThreeSchema = propertySchema.pick({
  // Areas
  area: true,
  livingArea: true,
  kitchenArea: true,
  rooms: true,
  bedrooms: true,
  bathrooms: true,
  // Building
  floor: true,
  totalFloors: true,
  yearBuilt: true,
  ceilingHeight: true,
  buildingType: true,
  // Features
  parking: true,
  parkingType: true,
  balcony: true,
  loggia: true,
  elevatorPassenger: true,
  elevatorCargo: true,
  hasGarbageChute: true,
  hasConcierge: true,
  hasGatedArea: true,
})

export const stepFourSchema = propertySchema.pick({
  // Condition
  renovation: true,
  windowView: true,
  bathroomType: true,
  furnished: true,
})

export const stepFiveSchema = propertySchema.pick({
  images: true,
})

export const stepSixSchema = propertySchema.pick({
  description: true,
  amenities: true,
})

export type StepOneData = z.infer<typeof stepOneSchema>
export type StepTwoData = z.infer<typeof stepTwoSchema>
export type StepThreeData = z.infer<typeof stepThreeSchema>
export type StepFourData = z.infer<typeof stepFourSchema>
export type StepFiveData = z.infer<typeof stepFiveSchema>
export type StepSixData = z.infer<typeof stepSixSchema>

// Labels for display
export const LABELS = {
  propertyType: {
    APARTMENT: 'Apartment',
    HOUSE: 'House',
    CONDO: 'Condo',
    TOWNHOUSE: 'Townhouse',
    LAND: 'Land',
    COMMERCIAL: 'Commercial',
    VILLA: 'Villa',
    STUDIO: 'Studio',
  },
  listingType: {
    SALE: 'For Sale',
    RENT: 'For Rent',
  },
  buildingType: {
    BRICK: 'Brick',
    PANEL: 'Panel',
    MONOLITHIC: 'Monolithic',
    WOOD: 'Wood',
    BLOCK: 'Block',
  },
  buildingClass: {
    ECONOMY: 'Economy',
    COMFORT: 'Comfort',
    BUSINESS: 'Business',
    ELITE: 'Elite/Premium',
  },
  parkingType: {
    STREET: 'Street Parking',
    UNDERGROUND: 'Underground',
    GARAGE: 'Garage',
    MULTI_LEVEL: 'Multi-level Parking',
  },
  renovation: {
    NONE: 'No Renovation',
    COSMETIC: 'Cosmetic',
    EURO: 'Euro Renovation',
    DESIGNER: 'Designer',
    NEEDS_REPAIR: 'Needs Repair',
  },
  windowView: {
    COURTYARD: 'Courtyard',
    STREET: 'Street',
    PARK: 'Park/Garden',
    WATER: 'Water View',
    PANORAMIC: 'Panoramic',
  },
  bathroomType: {
    COMBINED: 'Combined',
    SEPARATE: 'Separate',
    MULTIPLE: 'Multiple Bathrooms',
  },
  furnished: {
    NONE: 'Unfurnished',
    PARTIAL: 'Partially Furnished',
    FULL: 'Fully Furnished',
  },
} as const
