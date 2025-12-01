import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isAdmin } from '@/lib/admin'
import { getAllUsers } from '@/lib/db'
import { UserRoleSelect } from '@/components/admin/UserRoleSelect'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function AdminUsersPage() {
  // Check if user is admin
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    redirect('/')
  }

  // Get all users from database
  const users = await getAllUsers()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Total Users: <span className="font-semibold">{users.length}</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const role = user.role || 'user'
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.image && (
                            <img
                              src={user.image}
                              alt={user.name || 'User'}
                              className="h-10 w-10 rounded-full"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.email || 'No email'}
                      </TableCell>
                      <TableCell>
                        <UserRoleSelect userId={user.id} currentRole={role} />
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.emailVerified
                          ? new Date(user.emailVerified).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
