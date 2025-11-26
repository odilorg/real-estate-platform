import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { isAdmin } from '@/lib/admin'
import { getAllProperties } from '@/lib/db'
import { Eye, Edit, Trash2 } from 'lucide-react'

export default async function AdminPropertiesPage() {
  // Check if user is admin
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    redirect('/')
  }

  // Get all properties
  const properties = await getAllProperties()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-1">
            View and manage all properties on the platform
          </p>
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
                        <p className="text-sm text-gray-600">
                          {property.city}, {property.state} - {property.propertyType}
                        </p>
                      </div>
                      <Badge variant={property.listingType === 'SALE' ? 'default' : 'secondary'}>
                        {property.listingType}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        ${property.price.toLocaleString()}
                        {property.listingType === 'RENT' && '/mo'}
                      </span>
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
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
