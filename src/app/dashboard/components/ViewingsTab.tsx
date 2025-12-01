"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, MapPin, User, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Viewing {
  id: string
  propertyId: string
  requesterId: string
  ownerId: string
  date: string
  time: string
  status: string
  message?: string
  notes?: string
  createdAt: string
}

interface ViewingWithProperty extends Viewing {
  propertyTitle?: string
  requesterName?: string
}

export function ViewingsTab() {
  const { data: session } = useSession()
  const user = session?.user
  const t = useTranslations('dashboard')
  const [viewings, setViewings] = useState<ViewingWithProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchViewings()
  }, [])

  const fetchViewings = async () => {
    try {
      const response = await fetch('/api/viewings')
      if (response.ok) {
        const data = await response.json()
        setViewings(data)
      }
    } catch (error) {
      console.error('Error fetching viewings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const response = await fetch(`/api/viewings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setViewings(prev =>
          prev.map(v => (v.id === id ? { ...v, status } : v))
        )
        toast.success(t('viewingStatusUpdated'))
      } else {
        const error = await response.json()
        toast.error(error.error || t('viewingUpdateFailed'))
      }
    } catch (error) {
      toast.error(t('viewingUpdateFailed'))
    } finally {
      setUpdating(null)
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: t('statusPending'),
      CONFIRMED: t('statusConfirmed'),
      CANCELLED: t('statusCancelled'),
      COMPLETED: t('statusCompleted'),
    }
    return labels[status] || status
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
    }
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {getStatusLabel(status)}
      </Badge>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Separate viewings into requests (where user is requester) and incoming (where user is owner)
  const myRequests = viewings.filter(v => v.requesterId === user?.id)
  const incomingRequests = viewings.filter(v => v.ownerId === user?.id)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">{t('loadingViewings')}</span>
      </div>
    )
  }

  const renderViewingCard = (viewing: ViewingWithProperty, isOwner: boolean) => (
    <Card key={viewing.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Link
              href={`/properties/${viewing.propertyId}`}
              className="font-semibold text-lg hover:text-blue-600"
            >
              {t('property')} #{viewing.propertyId.slice(0, 8)}...
            </Link>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(viewing.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {viewing.time}
              </span>
            </div>

            {viewing.message && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">{t('message')}:</span> {viewing.message}
              </p>
            )}

            {viewing.notes && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">{t('notes')}:</span> {viewing.notes}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(viewing.status)}

            {isOwner && viewing.status === 'PENDING' && (
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => updateStatus(viewing.id, 'CONFIRMED')}
                  disabled={updating === viewing.id}
                >
                  {updating === viewing.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      {t('confirm')}
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateStatus(viewing.id, 'CANCELLED')}
                  disabled={updating === viewing.id}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('decline')}
                </Button>
              </div>
            )}

            {isOwner && viewing.status === 'CONFIRMED' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus(viewing.id, 'COMPLETED')}
                disabled={updating === viewing.id}
              >
                {t('markCompleted')}
              </Button>
            )}

            {!isOwner && viewing.status === 'PENDING' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateStatus(viewing.id, 'CANCELLED')}
                disabled={updating === viewing.id}
              >
                {t('cancelRequest')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('viewings')}</h2>
        <p className="text-gray-600 mt-1">
          {t('viewingsSubtitle')}
        </p>
      </div>

      <Tabs defaultValue="incoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incoming">
            {t('incomingRequests')} ({incomingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="my-requests">
            {t('myRequests')} ({myRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming">
          {incomingRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('noIncomingRequests')}
                </h3>
                <p className="text-gray-600">
                  {t('noIncomingRequestsDesc')}
                </p>
              </CardContent>
            </Card>
          ) : (
            incomingRequests.map(v => renderViewingCard(v, true))
          )}
        </TabsContent>

        <TabsContent value="my-requests">
          {myRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('noViewingRequests')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('noViewingRequestsDesc')}
                </p>
                <Link href="/properties">
                  <Button>{t('browseProperties')}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            myRequests.map(v => renderViewingCard(v, false))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
