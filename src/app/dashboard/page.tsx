"use client"

import { Suspense, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MainLayout } from '@/components/layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { OverviewTab } from './components/OverviewTab'
import { PropertiesTab } from './components/PropertiesTab'
import { FavoritesTab } from './components/FavoritesTab'
import { MessagesTab } from './components/MessagesTab'
import { ViewingsTab } from './components/ViewingsTab'
import { SettingsTab } from './components/SettingsTab'
import { InquiriesTab } from './components/InquiriesTab'
import { NotesTab } from './components/NotesTab'
import { SavedSearches } from '@/components/search/SavedSearches'

function DashboardLoading() {
  const t = useTranslations('dashboard')
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">{t('loading')}</span>
      </div>
    </MainLayout>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const isLoaded = status !== 'loading'
  const user = session?.user
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('dashboard')
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (isLoaded && !user) {
      router.push('/sign-in?redirect_url=/dashboard')
    }
  }, [isLoaded, user, router])

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/dashboard?tab=${value}`, { scroll: false })
  }

  if (!isLoaded || !user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">{t('loading')}</span>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
            <p className="text-gray-600">
              {t('welcomeUser', { name: user?.name?.split(' ')[0] || 'User' })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 lg:w-auto lg:inline-flex">
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="properties">{t('myProperties')}</TabsTrigger>
              <TabsTrigger value="inquiries">{t('inquiries')}</TabsTrigger>
              <TabsTrigger value="favorites">{t('favorites')}</TabsTrigger>
              <TabsTrigger value="viewings">{t('viewings')}</TabsTrigger>
              <TabsTrigger value="notes">{t('notes')}</TabsTrigger>
              <TabsTrigger value="searches">{t('savedSearches')}</TabsTrigger>
              <TabsTrigger value="messages">{t('messages')}</TabsTrigger>
              <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="overview" className="space-y-6">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <PropertiesTab />
            </TabsContent>

            <TabsContent value="inquiries" className="space-y-6">
              <InquiriesTab />
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <FavoritesTab />
            </TabsContent>

            <TabsContent value="viewings" className="space-y-6">
              <ViewingsTab />
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <NotesTab />
            </TabsContent>

            <TabsContent value="searches" className="space-y-6">
              <SavedSearches />
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <MessagesTab />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  )
}
