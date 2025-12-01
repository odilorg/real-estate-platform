"use client"

import { useTranslations } from 'next-intl'
import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, LogOut } from 'lucide-react'

export function SettingsTab() {
  const { data: session } = useSession()
  const user = session?.user
  const t = useTranslations('dashboard')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('settings')}</h2>
        <p className="text-gray-600 mt-1">{t('settingsSubtitle')}</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('profileInformation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-lg">
                {user?.name || 'User'}
              </p>
              <p className="text-gray-600">{user?.email || t('noUsernameSet')}</p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">{t('email')}</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              {t('updateProfileHint')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('accountActions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('signOut')}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>{t('notifications')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {t('notificationsComingSoon')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
