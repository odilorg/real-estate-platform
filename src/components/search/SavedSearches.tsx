"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Trash2, Search, Bell, BellOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface SavedSearch {
  id: string
  name: string
  filters: any
  notificationsEnabled: boolean
  createdAt: string
}

export function SavedSearches() {
  const router = useRouter()
  const [searches, setSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchSavedSearches()
  }, [])

  const fetchSavedSearches = async () => {
    try {
      const res = await fetch('/api/saved-searches')
      if (res.ok) {
        const data = await res.json()
        setSearches(data.savedSearches)
      }
    } catch (error) {
      console.error('Error fetching saved searches:', error)
      toast.error('Failed to load saved searches')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved search?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/saved-searches/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Saved search deleted')
        setSearches(searches.filter(s => s.id !== id))
      } else {
        toast.error('Failed to delete saved search')
      }
    } catch (error) {
      console.error('Error deleting saved search:', error)
      toast.error('Failed to delete saved search')
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleNotifications = async (id: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/saved-searches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationsEnabled: enabled }),
      })

      if (res.ok) {
        setSearches(searches.map(s =>
          s.id === id ? { ...s, notificationsEnabled: enabled } : s
        ))
        toast.success(enabled ? 'Notifications enabled' : 'Notifications disabled')
      } else {
        toast.error('Failed to update notifications')
      }
    } catch (error) {
      console.error('Error updating notifications:', error)
      toast.error('Failed to update notifications')
    }
  }

  const handleRunSearch = (search: SavedSearch) => {
    // Build query params from filters
    const params = new URLSearchParams()

    if (search.filters.query) params.append('query', search.filters.query)
    if (search.filters.propertyTypes?.length) {
      params.append('propertyType', search.filters.propertyTypes[0])
    }
    if (search.filters.listingTypes?.length) {
      params.append('listingType', search.filters.listingTypes[0])
    }
    if (search.filters.minPrice) params.append('minPrice', search.filters.minPrice.toString())
    if (search.filters.maxPrice) params.append('maxPrice', search.filters.maxPrice.toString())
    if (search.filters.minBedrooms) params.append('minBedrooms', search.filters.minBedrooms.toString())
    if (search.filters.city) params.append('city', search.filters.city)
    if (search.filters.state) params.append('state', search.filters.state)

    router.push(`/properties?${params.toString()}`)
  }

  const getFilterSummary = (filters: any): string => {
    const parts = []

    if (filters.propertyTypes?.length) {
      parts.push(`${filters.propertyTypes.join(', ')}`)
    }
    if (filters.listingTypes?.length) {
      parts.push(filters.listingTypes.map((t: string) => t === 'SALE' ? 'For Sale' : 'For Rent').join(', '))
    }
    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? `$${filters.minPrice.toLocaleString()}` : '$0'
      const max = filters.maxPrice ? `$${filters.maxPrice.toLocaleString()}` : 'Any'
      parts.push(`${min} - ${max}`)
    }
    if (filters.minBedrooms) {
      parts.push(`${filters.minBedrooms}+ beds`)
    }
    if (filters.city || filters.state) {
      parts.push([filters.city, filters.state].filter(Boolean).join(', '))
    }
    if (filters.amenities?.length) {
      parts.push(`${filters.amenities.length} amenities`)
    }
    if (filters.radius && filters.latitude && filters.longitude) {
      parts.push(`${filters.radius} mi radius`)
    }

    return parts.length > 0 ? parts.join(' • ') : 'No filters'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading saved searches...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {searches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No saved searches yet
            </h3>
            <p className="text-gray-600 mb-4">
              Save your search filters to quickly access them later and get notifications for new listings.
            </p>
            <Button onClick={() => router.push('/properties')}>
              <Search className="h-4 w-4 mr-2" />
              Browse Properties
            </Button>
          </CardContent>
        </Card>
      ) : (
        searches.map((search) => (
          <Card key={search.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {search.name}
                    {search.notificationsEnabled && (
                      <Badge variant="secondary" className="ml-2">
                        <Bell className="h-3 w-3 mr-1" />
                        Alerts On
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    {getFilterSummary(search.filters)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Saved {new Date(search.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRunSearch(search)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Run Search
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(search.id)}
                    disabled={deleting === search.id}
                  >
                    {deleting === search.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-600" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  {search.notificationsEnabled ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                  <span>Email notifications</span>
                </div>
                <Switch
                  checked={search.notificationsEnabled}
                  onCheckedChange={(checked) => handleToggleNotifications(search.id, checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
