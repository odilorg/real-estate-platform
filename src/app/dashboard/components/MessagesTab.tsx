"use client"

import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export function MessagesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-gray-600 mt-1">Communicate with buyers and sellers</p>
      </div>

      <Card>
        <CardContent className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <MessageSquare className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Messages Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            The messaging feature is under development. Soon you'll be able to chat directly with
            property owners and interested buyers.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
