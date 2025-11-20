"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { OverviewTab } from './components/OverviewTab'
import { PropertiesTab } from './components/PropertiesTab'
import { FavoritesTab } from './components/FavoritesTab'
import { MessagesTab } from './components/MessagesTab'
import { SettingsTab } from './components/SettingsTab'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
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
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
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
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user.firstName || user.username || 'User'}!
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="properties">My Properties</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="overview" className="space-y-6">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <PropertiesTab />
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <FavoritesTab />
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
