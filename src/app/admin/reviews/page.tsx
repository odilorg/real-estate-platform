import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import { getAllReviews, getPropertyById } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs/server'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StarRating } from '@/components/reviews/StarRating'
import { DeleteReviewButton } from '@/components/admin/DeleteReviewButton'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function AdminReviewsPage() {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    redirect('/')
  }

  const reviews = await getAllReviews()

  // Enrich reviews with user and property info
  const enrichedReviews = await Promise.all(
    reviews.map(async (review) => {
      const property = await getPropertyById(review.propertyId)

      try {
        const client = await clerkClient()
        const user = await client.users.getUser(review.userId)
        return {
          ...review,
          user: {
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
            email: user.emailAddresses[0]?.emailAddress || '',
          },
          property: property ? {
            id: property.id,
            title: property.title,
          } : null,
        }
      } catch {
        return {
          ...review,
          user: {
            id: review.userId,
            name: 'Unknown User',
            email: '',
          },
          property: property ? {
            id: property.id,
            title: property.title,
          } : null,
        }
      }
    })
  )

  // Separate approved and pending reviews
  const approvedCount = enrichedReviews.filter(r => r.approved).length
  const pendingCount = enrichedReviews.filter(r => !r.approved).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all property reviews. Total: {reviews.length}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {enrichedReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No reviews yet
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrichedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      {review.property ? (
                        <a
                          href={`/properties/${review.property.id}`}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {review.property.title}
                        </a>
                      ) : (
                        <span className="text-gray-400">Unknown Property</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.user.name}</div>
                        <div className="text-sm text-gray-500">{review.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={review.rating} size={16} />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={review.comment}>
                        {review.comment}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={review.approved ? 'default' : 'secondary'}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DeleteReviewButton reviewId={review.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
