"use client"

import { useState, useEffect } from 'react'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { Button } from '@/components/ui/button'
import { Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Property } from '@/types'

export function FavoritesTab() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading favorites...</span>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <Heart className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Browse properties and click the heart icon to save your favorites
        </p>
        <Link href="/properties">
          <Button size="lg">Browse Properties</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Favorites</h2>
        <p className="text-gray-600 mt-1">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
        </p>
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}
