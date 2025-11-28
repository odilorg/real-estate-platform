"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export function MessagesTab() {
  const t = useTranslations('dashboard')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('messages')}</h2>
        <p className="text-gray-600 mt-1">{t('messagesSubtitle')}</p>
      </div>

      <Card>
        <CardContent className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <MessageSquare className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('messagesComingSoon')}</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {t('messagesComingSoonDesc')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
