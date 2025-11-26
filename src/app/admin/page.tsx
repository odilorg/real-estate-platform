import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isAdmin } from '@/lib/admin'
import { getAllProperties, getAllFavorites } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs/server'
import {
  Users,
  Home,
  Heart,
  TrendingUp,
  DollarSign,
  Eye,
} from 'lucide-react'

export default async function AdminDashboardPage() {
  // Check if user is admin
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    redirect('/') // Redirect non-admins to home
  }

  // Get statistics
  const properties = await getAllProperties()
  const favorites = await getAllFavorites()

  // Get total users from Clerk
  const client = await clerkClient()
  const usersResponse = await client.users.getUserList({ limit: 1 })
  const totalUsers = usersResponse.totalCount

  // Calculate stats
  const stats = {
    totalUsers,
    totalProperties: properties.length,
    totalFavorites: favorites.length,
    propertiesForSale: properties.filter(p => p.listingType === 'SALE').length,
    propertiesForRent: properties.filter(p => p.listingType === 'RENT').length,
    averagePrice: properties.length > 0
      ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length
      : 0,
  }

  // Recent properties
  const recentProperties = properties
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            Welcome to the admin panel. Here's what's happening on your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Properties
              </CardTitle>
              <Home className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.propertiesForSale} for sale, {stats.propertiesForRent} for rent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Favorites
              </CardTitle>
              <Heart className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalFavorites}</div>
              <p className="text-xs text-gray-500 mt-1">Properties saved by users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Property Price
              </CardTitle>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${Math.round(stats.averagePrice).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Across all listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                For Sale
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.propertiesForSale}</div>
              <p className="text-xs text-gray-500 mt-1">Properties listed for sale</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                For Rent
              </CardTitle>
              <Eye className="h-5 w-5 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.propertiesForRent}</div>
              <p className="text-xs text-gray-500 mt-1">Properties listed for rent</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{property.title}</h4>
                    <p className="text-sm text-gray-600">
                      {property.city}, {property.state} - {property.propertyType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      ${property.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentProperties.length === 0 && (
                <p className="text-center text-gray-500 py-8">No properties yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
