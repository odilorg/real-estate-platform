import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isAdmin } from '@/lib/admin'
import { Settings as SettingsIcon } from 'lucide-react'

export default async function AdminSettingsPage() {
  // Check if user is admin
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    redirect('/')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure platform settings and preferences
          </p>
        </div>

        <Card>
          <CardContent className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <SettingsIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Settings Coming Soon
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Platform configuration options will be available here. Manage site settings,
              email templates, payment options, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
