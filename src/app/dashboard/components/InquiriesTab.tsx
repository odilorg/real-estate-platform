"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Eye,
  Send,
  Archive,
  Loader2,
  Home,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'

interface Inquiry {
  id: string
  propertyId: string
  senderName: string
  senderEmail: string
  senderPhone: string | null
  message: string
  inquiryType: string
  status: string
  response: string | null
  respondedAt: string | null
  createdAt: string
  property?: {
    id: string
    title: string
    images?: { url: string }[]
  }
}

interface InquiryStats {
  total: number
  new: number
  read: number
  responded: number
}

export function InquiriesTab() {
  const t = useTranslations('dashboard.inquiriesTab')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [stats, setStats] = useState<InquiryStats>({ total: 0, new: 0, read: 0, responded: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [responseText, setResponseText] = useState('')
  const [isResponding, setIsResponding] = useState(false)
  const [activeTab, setActiveTab] = useState('new')

  useEffect(() => {
    loadInquiries()
  }, [])

  const loadInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries')
      if (res.ok) {
        const data = await res.json()
        setInquiries(data.inquiries || [])
        setStats(data.stats || { total: 0, new: 0, read: 0, responded: 0 })
      }
    } catch (error) {
      console.error('Error loading inquiries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewInquiry = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setResponseText(inquiry.response || '')

    // Mark as read if new
    if (inquiry.status === 'NEW') {
      try {
        await fetch(`/api/inquiries/${inquiry.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'READ' }),
        })
        loadInquiries()
      } catch (error) {
        console.error('Error marking as read:', error)
      }
    }
  }

  const handleRespond = async () => {
    if (!selectedInquiry || !responseText.trim()) return

    setIsResponding(true)
    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: responseText }),
      })

      if (res.ok) {
        toast.success(t('responseSent'))
        setSelectedInquiry(null)
        loadInquiries()
      } else {
        toast.error(t('responseFailed'))
      }
    } catch (error) {
      toast.error(t('responseFailed'))
    } finally {
      setIsResponding(false)
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' }),
      })
      toast.success(t('inquiryArchived'))
      loadInquiries()
    } catch (error) {
      toast.error(t('archiveFailed'))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />{t('new')}</Badge>
      case 'READ':
        return <Badge variant="outline"><Eye className="h-3 w-3 mr-1" />{t('read')}</Badge>
      case 'RESPONDED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />{t('responded')}</Badge>
      case 'ARCHIVED':
        return <Badge variant="secondary"><Archive className="h-3 w-3 mr-1" />{t('archived')}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'GENERAL':
        return t('typeGeneral') || 'General'
      case 'VIEWING':
        return t('typeViewing') || 'Viewing'
      case 'PRICE':
        return t('typePrice') || 'Price'
      case 'DETAILS':
        return t('typeDetails') || 'Details'
      default:
        return type
    }
  }

  const filteredInquiries = inquiries.filter(inq => {
    if (activeTab === 'new') return inq.status === 'NEW'
    if (activeTab === 'read') return inq.status === 'READ'
    if (activeTab === 'responded') return inq.status === 'RESPONDED'
    return inq.status !== 'ARCHIVED'
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
              <p className="text-sm text-gray-500">{t('newInquiries')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">{stats.read}</p>
              <p className="text-sm text-gray-500">{t('read')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.responded}</p>
              <p className="text-sm text-gray-500">{t('responded')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-500">{t('total')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="new">
            {t('new')} {stats.new > 0 && <Badge className="ml-2 bg-blue-500">{stats.new}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="read">{t('read')}</TabsTrigger>
          <TabsTrigger value="responded">{t('responded')}</TabsTrigger>
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredInquiries.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">{t('noInquiries')}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {t('noInquiriesDesc')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      {/* Property Image */}
                      <div className="h-20 w-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {inquiry.property?.images?.[0] ? (
                          <img
                            src={inquiry.property.images[0].url}
                            alt={inquiry.property.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Home className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold">{inquiry.senderName}</h4>
                            <p className="text-sm text-gray-500 truncate">
                              {inquiry.property?.title || t('property')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(inquiry.status)}
                            <Badge variant="outline">{getTypeLabel(inquiry.inquiryType)}</Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {inquiry.message}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {inquiry.senderEmail}
                          </span>
                          {inquiry.senderPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {inquiry.senderPhone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleViewInquiry(inquiry)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {inquiry.status === 'RESPONDED' ? t('view') : t('respond')}
                        </Button>
                        {inquiry.status !== 'ARCHIVED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleArchive(inquiry.id)}
                          >
                            <Archive className="h-4 w-4 mr-1" />
                            {t('archive')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('inquiryFrom', { name: selectedInquiry?.senderName })}</DialogTitle>
            <DialogDescription>
              {selectedInquiry?.property?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4">
              {/* Contact Info */}
              <div className="flex flex-wrap gap-3 text-sm">
                <a
                  href={`mailto:${selectedInquiry.senderEmail}`}
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {selectedInquiry.senderEmail}
                </a>
                {selectedInquiry.senderPhone && (
                  <a
                    href={`tel:${selectedInquiry.senderPhone}`}
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {selectedInquiry.senderPhone}
                  </a>
                )}
              </div>

              {/* Inquiry Type & Date */}
              <div className="flex items-center gap-2">
                <Badge variant="outline">{getTypeLabel(selectedInquiry.inquiryType)}</Badge>
                <span className="text-sm text-gray-500">
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Message */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              {/* Response Section */}
              {selectedInquiry.status === 'RESPONDED' && selectedInquiry.response ? (
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">
                    {t('yourResponseAt', { date: new Date(selectedInquiry.respondedAt!).toLocaleString() })}
                  </label>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm whitespace-pre-wrap">{selectedInquiry.response}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {t('yourResponse')}
                  </label>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder={t('responsePlaceholder')}
                    rows={4}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedInquiry(null)}>
              {t('close')}
            </Button>
            {selectedInquiry?.status !== 'RESPONDED' && (
              <Button
                onClick={handleRespond}
                disabled={isResponding || !responseText.trim()}
              >
                {isResponding ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {t('sendResponse')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
