"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { Button } from '@/components/ui/button'
import { Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Property } from '@/types'

export default function FavoritesPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (isLoaded && !user) {
      router.push('/sign-in?redirect_url=/favorites')
      return
    }

    if (isLoaded && user) {
      fetchFavorites()
    }
  }, [isLoaded, user, router])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (!response.ok) throw new Error('Failed to fetch favorites')

      const data = await response.json()
      setProperties(data)
    } catch (err) {
      setError('Failed to load your favorites. Please try again.')
      console.error('Error fetching favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading favorites...</span>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <h1 className="text-3xl font-bold">My Favorites</h1>
            </div>
            <p className="text-gray-600">
              {properties.length === 0
                ? 'You haven\'t saved any properties yet'
                : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} saved`}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
              <p className="text-red-800">{error}</p>
              <Button variant="outline" onClick={fetchFavorites} className="mt-4">
                Retry
              </Button>
            </div>
          )}

          {/* Property Cards */}
          {!error && properties.length > 0 && (
            <div className="space-y-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!error && properties.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Heart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start browsing properties and click the heart icon to save your favorites here
              </p>
              <Link href="/properties">
                <Button size="lg">
                  Browse Properties
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
