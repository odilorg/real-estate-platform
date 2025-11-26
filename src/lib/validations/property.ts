import { z } from 'zod'

export const propertySchema = z.object({
  // Basic Information
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  propertyType: z.enum(['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'VILLA', 'STUDIO']),
  listingType: z.enum(['SALE', 'RENT']),
  price: z.number().positive('Price must be positive'),

  // Location
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),

  // Property Details
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  area: z.number().positive().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 1).optional(),
  floor: z.number().int().min(0).optional(),
  totalFloors: z.number().int().min(1).optional(),
  parking: z.number().int().min(0).optional(),

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
})

export const stepTwoSchema = propertySchema.pick({
  address: true,
  city: true,
  state: true,
  zipCode: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  yearBuilt: true,
  floor: true,
  totalFloors: true,
  parking: true,
})

export const stepThreeSchema = propertySchema.pick({
  images: true,
})

export const stepFourSchema = propertySchema.pick({
  description: true,
  amenities: true,
})

export type StepOneData = z.infer<typeof stepOneSchema>
export type StepTwoData = z.infer<typeof stepTwoSchema>
export type StepThreeData = z.infer<typeof stepThreeSchema>
export type StepFourData = z.infer<typeof stepFourSchema>
