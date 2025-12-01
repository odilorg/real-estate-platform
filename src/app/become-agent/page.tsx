"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { MainLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Users,
  TrendingUp,
  Shield,
  Award,
  Loader2,
  Clock,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

type ApplicationStatus = 'none' | 'PENDING' | 'APPROVED' | 'REJECTED'

export default function BecomeAgentPage() {
  const t = useTranslations('agent.become')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const isLoaded = sessionStatus !== 'loading'
  const isSignedIn = sessionStatus === 'authenticated'
  const user = session?.user

  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>('none')
  const [rejectionReason, setRejectionReason] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    licenseNumber: '',
    yearsExperience: '',
    bio: '',
    specializations: '',
    areasServed: '',
  })

  // Check existing application status
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      checkApplicationStatus()
      // Pre-fill from user data
      const nameParts = user?.name?.split(' ') || []
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user?.email || '',
      }))
    } else if (isLoaded && !isSignedIn) {
      setIsLoading(false)
    }
  }, [isLoaded, isSignedIn, user])

  const checkApplicationStatus = async () => {
    try {
      const res = await fetch('/api/agent-application/status')
      if (res.ok) {
        const data = await res.json()
        setApplicationStatus(data.status || 'none')
        setRejectionReason(data.rejectionReason)
      }
    } catch (error) {
      console.error('Error checking status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSignedIn) {
      toast.error('Please sign in to apply')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/agent-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          yearsExperience: parseInt(formData.yearsExperience) || 0,
          specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean),
          areasServed: formData.areasServed.split(',').map(s => s.trim()).filter(Boolean),
        }),
      })

      if (res.ok) {
        setApplicationStatus('PENDING')
        toast.success('Application submitted successfully!')
      } else {
        const error = await res.json()
        toast.error(error.message || 'Failed to submit application')
      }
    } catch (error) {
      toast.error('Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    )
  }

  // If user is already an approved agent, redirect
  if (applicationStatus === 'APPROVED') {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">You're Already an Agent!</h2>
              <p className="text-gray-600 mb-6">
                Your application has been approved. You can now access your agent dashboard.
              </p>
              <Button onClick={() => router.push('/agent/dashboard')}>
                Go to Agent Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  // If application is pending
  if (applicationStatus === 'PENDING') {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Application Under Review</h2>
              <p className="text-gray-600 mb-4">
                Your application is being reviewed by our team. We'll notify you once a decision is made.
              </p>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                <Clock className="h-3 w-3 mr-1" />
                Pending Review
              </Badge>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  // If application was rejected
  if (applicationStatus === 'REJECTED') {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Application Not Approved</h2>
              <p className="text-gray-600 mb-4">
                Unfortunately, your application was not approved at this time.
              </p>
              {rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
                  <p className="text-sm font-medium text-red-800">Reason:</p>
                  <p className="text-sm text-red-700">{rejectionReason}</p>
                </div>
              )}
              <p className="text-sm text-gray-500">
                You may reapply after addressing the concerns mentioned above.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              <Award className="h-3 w-3 mr-1" />
              Join Our Network
            </Badge>
            <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
            <p className="text-xl text-gray-600">{t('subtitle')}</p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Reach Buyers</h3>
                <p className="text-sm text-gray-600">{t('benefit1')}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Verified Badge</h3>
                <p className="text-sm text-gray-600">{t('benefit4')}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Analytics</h3>
                <p className="text-sm text-gray-600">{t('benefit3')}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Pro Profile</h3>
                <p className="text-sm text-gray-600">{t('benefit2')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Agent Application</CardTitle>
              <CardDescription>
                Fill out the form below to apply. Applications are reviewed within 2-3 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSignedIn ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Please sign in to submit an application</p>
                  <Button onClick={() => router.push('/sign-in')}>Sign In</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+998 90 123 4567"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Professional Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company/Agency Name</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Optional"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of Experience *</Label>
                      <Input
                        id="yearsExperience"
                        name="yearsExperience"
                        type="number"
                        min="0"
                        value={formData.yearsExperience}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">About You *</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about your experience and why you want to join..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specializations">Specializations</Label>
                      <Input
                        id="specializations"
                        name="specializations"
                        value={formData.specializations}
                        onChange={handleChange}
                        placeholder="e.g., Residential, Commercial, Luxury (comma separated)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="areasServed">Areas Served *</Label>
                      <Input
                        id="areasServed"
                        name="areasServed"
                        value={formData.areasServed}
                        onChange={handleChange}
                        placeholder="e.g., Tashkent, Samarkand (comma separated)"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      t('apply')
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
