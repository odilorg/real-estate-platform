"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { MainLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { User, Mail, Save, Loader2, Camera, X } from 'lucide-react'
import { UploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const t = useTranslations('dashboard')

  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  // Update form data when session loads
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
      })
      setProfileImage(session.user.image || null)
    }
  }, [session])

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </MainLayout>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/sign-in')
    return null
  }

  const user = session?.user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/users/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Update the session with new data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
        },
      })

      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('profileInformation') || 'Profile'}</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('profileInfo') || 'Profile Information'}
              </CardTitle>
              <CardDescription>
                {t('updateProfileHint') || 'Update your personal information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar with Upload */}
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    {profileImage ? (
                      <div className="relative h-24 w-24 rounded-full overflow-hidden">
                        <Image
                          src={profileImage}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-lg">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
                    <UploadButton<OurFileRouter, "profileImage">
                      endpoint="profileImage"
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          setProfileImage(res[0].url)
                          // Update session with new image
                          update({
                            ...session,
                            user: {
                              ...session?.user,
                              image: res[0].url,
                            },
                          })
                          toast.success('Profile image updated!')
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`)
                      }}
                      appearance={{
                        button: "bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md",
                        allowedContent: "text-xs text-gray-500",
                      }}
                      content={{
                        button: "Change Photo",
                        allowedContent: "Max 2MB (JPG, PNG)",
                      }}
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">User ID</span>
                <span className="font-mono text-sm">{user?.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Role</span>
                <span className="capitalize">{(user as any)?.role || 'User'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
