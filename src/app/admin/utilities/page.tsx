import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import { AssignOwnersButton } from '@/components/admin/AssignOwnersButton'

export default async function UtilitiesPage() {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    redirect('/')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Utilities</h1>
        <p className="text-gray-600 mt-2">One-time setup and maintenance tools</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Assign Property Owners</h2>
        <p className="text-sm text-gray-600 mb-4">
          This will assign owners to all properties that don't have one. This is needed for
          the messaging system to work properly.
        </p>
        <AssignOwnersButton />
      </div>
    </div>
  )
}
