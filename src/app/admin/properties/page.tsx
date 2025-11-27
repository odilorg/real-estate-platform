import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { isAdmin } from '@/lib/admin'
import { getAllProperties } from '@/lib/db'
import { Eye, Edit, MapPin, Building, Calendar } from 'lucide-react'
import { AdminDeletePropertyButton } from '@/components/admin/AdminDeletePropertyButton'

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'ACTIVE': return 'default'
    case 'SOLD': return 'secondary'
    case 'RENTED': return 'secondary'
    case 'PENDING': return 'outline'
    case 'DRAFT': return 'outline'
    default: return 'default'
  }
}

export default async function AdminPropertiesPage() {
  // Check if user is admin
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    redirect('/')
  }

  // Get all properties
  const properties = await getAllProperties()

  // Group by status
  const activeCount = properties.filter(p => p.status === 'ACTIVE').length
  const soldCount = properties.filter(p => p.status === 'SOLD').length
  const rentedCount = properties.filter(p => p.status === 'RENTED').length
  const pendingCount = properties.filter(p => p.status === 'PENDING').length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-1">
            View and manage all properties on the platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-blue-600">{soldCount}</div>
            <div className="text-sm text-gray-600">Sold</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-purple-600">{rentedCount}</div>
            <div className="text-sm text-gray-600">Rented</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Properties ({properties.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="flex gap-4 border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="relative h-24 w-32 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={property.images[0] || '/placeholder.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.city}, {property.state}
                          <span className="mx-2">|</span>
                          <Building className="h-3 w-3 mr-1" />
                          {property.propertyType}
                          <span className="mx-2">|</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(property.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={property.listingType === 'SALE' ? 'default' : 'secondary'}>
                          {property.listingType}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(property.status)}>
                          {property.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-blue-600">
                          ${property.price.toLocaleString()}
                          {property.listingType === 'RENT' && '/mo'}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          {property.views} views
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/properties/${property.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/properties/${property.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <AdminDeletePropertyButton
                          propertyId={property.id}
                          propertyTitle={property.title}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <p className="text-center text-gray-500 py-8">No properties found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
