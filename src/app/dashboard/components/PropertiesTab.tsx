"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Home, PlusCircle, Edit, Trash2, Eye, MapPin,
  Bed, Bath, Maximize, Loader2
} from 'lucide-react'
import { DeleteModal } from './DeleteModal'

interface Property {
  id: string
  title: string
  description: string
  price: number
  propertyType: string
  listingType: string
  address: string
  city: string
  state?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images: string[]
  createdAt: Date
}

export function PropertiesTab() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/users/me/properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (propertyId: string) => {
    setPropertyToDelete(propertyId)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/properties/${propertyToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from UI
        setProperties(properties.filter((p) => p.id !== propertyToDelete))
        setDeleteModalOpen(false)
        setPropertyToDelete(null)
      } else {
        alert('Failed to delete property. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading your properties...</span>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <Home className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No properties listed yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start earning by listing your first property on the platform
        </p>
        <Link href="/properties/new">
          <Button size="lg">
            <PlusCircle className="h-5 w-5 mr-2" />
            List Your First Property
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Properties</h2>
          <p className="text-gray-600 mt-1">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
          </p>
        </div>
        <Link href="/properties/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>

      {/* Property Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="relative h-48">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="secondary" className="bg-white/90">
                  {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="text-xl font-bold text-blue-600 mb-1">
                  {formatPrice(property.price)}
                  {property.listingType === 'RENT' && (
                    <span className="text-sm text-gray-600 font-normal">/mo</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                  {property.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="line-clamp-1">{property.city}, {property.state}</span>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms}
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms}
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center">
                    <Maximize className="h-4 w-4 mr-1" />
                    {property.area} sq ft
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Link href={`/properties/${property.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href={`/properties/${property.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(property.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />
    </div>
  )
}
