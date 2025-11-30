"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { toast } from 'sonner'

interface Property {
  id: string
  title: string
  price: number
  listingType: string
  propertyType: string
  address: string
  city: string
  state?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  livingArea?: number
  kitchenArea?: number
  rooms?: number
  floor?: number
  totalFloors?: number
  yearBuilt?: number
  parking?: number
  balcony?: number
  buildingType?: string
  buildingClass?: string
  renovation?: string
  furnished?: string
  images: string[]
  amenities?: string[]
}

interface ComparisonContextType {
  properties: Property[]
  addToComparison: (property: Property) => void
  removeFromComparison: (propertyId: string) => void
  clearComparison: () => void
  isInComparison: (propertyId: string) => boolean
  canAddMore: boolean
  maxProperties: number
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

const MAX_COMPARISON_PROPERTIES = 4

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([])

  const addToComparison = useCallback((property: Property) => {
    setProperties((prev) => {
      if (prev.length >= MAX_COMPARISON_PROPERTIES) {
        toast.error(`Maximum ${MAX_COMPARISON_PROPERTIES} properties can be compared`)
        return prev
      }
      if (prev.some((p) => p.id === property.id)) {
        toast.info('Property already in comparison')
        return prev
      }
      toast.success('Added to comparison', {
        action: {
          label: 'View',
          onClick: () => window.location.href = '/compare'
        }
      })
      return [...prev, property]
    })
  }, [])

  const removeFromComparison = useCallback((propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId))
    toast.success('Removed from comparison')
  }, [])

  const clearComparison = useCallback(() => {
    setProperties([])
    toast.success('Comparison cleared')
  }, [])

  const isInComparison = useCallback((propertyId: string) => {
    return properties.some((p) => p.id === propertyId)
  }, [properties])

  const canAddMore = properties.length < MAX_COMPARISON_PROPERTIES

  return (
    <ComparisonContext.Provider
      value={{
        properties,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddMore,
        maxProperties: MAX_COMPARISON_PROPERTIES,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}
