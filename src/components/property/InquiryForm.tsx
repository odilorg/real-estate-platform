"use client"

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Mail, Phone, User, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface InquiryFormProps {
  propertyId: string
  propertyTitle: string
  ownerName?: string
}

export function InquiryForm({ propertyId, propertyTitle, ownerName }: InquiryFormProps) {
  const { user, isLoaded } = useUser()
  const t = useTranslations('inquiry')

  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    message: '',
    inquiryType: 'GENERAL',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Pre-fill user data when loaded
  useState(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        senderName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || prev.senderName,
        senderEmail: user.primaryEmailAddress?.emailAddress || prev.senderEmail,
      }))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          ...formData,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to send inquiry')
      }

      setIsSubmitted(true)
      toast.success(t('sent') || 'Inquiry sent successfully!')
    } catch (error) {
      console.error('Error sending inquiry:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send inquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('thankYou') || 'Thank You!'}</h3>
            <p className="text-gray-600 mb-4">
              {t('sentMessage') || 'Your inquiry has been sent. The property owner will contact you soon.'}
            </p>
            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
              {t('sendAnother') || 'Send Another Inquiry'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          {t('title') || 'Contact About This Property'}
        </CardTitle>
        {ownerName && (
          <p className="text-sm text-gray-500">
            {t('contactingOwner') || 'Contacting:'} {ownerName}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Inquiry Type */}
          <div>
            <Label>{t('inquiryType') || 'Inquiry Type'}</Label>
            <Select
              value={formData.inquiryType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, inquiryType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">{t('typeGeneral') || 'General Inquiry'}</SelectItem>
                <SelectItem value="VIEWING">{t('typeViewing') || 'Schedule Viewing'}</SelectItem>
                <SelectItem value="PRICE">{t('typePrice') || 'Price Negotiation'}</SelectItem>
                <SelectItem value="DETAILS">{t('typeDetails') || 'Request More Details'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="senderName">{t('yourName') || 'Your Name'} *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="senderName"
                value={formData.senderName}
                onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                placeholder={t('namePlaceholder') || 'Enter your name'}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="senderEmail">{t('yourEmail') || 'Your Email'} *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="senderEmail"
                type="email"
                value={formData.senderEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, senderEmail: e.target.value }))}
                placeholder={t('emailPlaceholder') || 'Enter your email'}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="senderPhone">{t('yourPhone') || 'Your Phone'}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="senderPhone"
                type="tel"
                value={formData.senderPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, senderPhone: e.target.value }))}
                placeholder={t('phonePlaceholder') || '+1 (555) 000-0000'}
                className="pl-10"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">{t('message') || 'Message'} *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder={t('messagePlaceholder') || `I'm interested in "${propertyTitle}". Please contact me with more details.`}
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('sending') || 'Sending...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('sendInquiry') || 'Send Inquiry'}
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            {t('privacyNote') || 'Your information will only be shared with the property owner.'}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
