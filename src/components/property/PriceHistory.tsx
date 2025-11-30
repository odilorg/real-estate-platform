"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingDown, TrendingUp, Minus, History, Loader2 } from 'lucide-react'

interface PriceHistoryEntry {
  id: string
  propertyId: string
  price: number
  changeType: string
  changedAt: string
}

interface PriceHistoryProps {
  propertyId: string
  currentPrice: number
}

export function PriceHistory({ propertyId, currentPrice }: PriceHistoryProps) {
  const [history, setHistory] = useState<PriceHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [propertyId])

  const loadHistory = async () => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/price-history`)
      if (res.ok) {
        const data = await res.json()
        setHistory(data.history || [])
      }
    } catch (error) {
      console.error('Error loading price history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getChangeIcon = (changeType: string, index: number) => {
    if (index === 0 || changeType === 'INITIAL') {
      return <Minus className="h-4 w-4 text-gray-400" />
    }
    if (changeType === 'REDUCTION') {
      return <TrendingDown className="h-4 w-4 text-green-600" />
    }
    if (changeType === 'INCREASE') {
      return <TrendingUp className="h-4 w-4 text-red-600" />
    }
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getChangeBadge = (entry: PriceHistoryEntry, prevPrice?: number) => {
    if (!prevPrice || entry.changeType === 'INITIAL') {
      return <Badge variant="outline">Initial</Badge>
    }

    const change = entry.price - prevPrice
    const percentChange = ((change / prevPrice) * 100).toFixed(1)

    if (change < 0) {
      return (
        <Badge className="bg-green-100 text-green-800">
          {percentChange}% ({formatPrice(change)})
        </Badge>
      )
    } else if (change > 0) {
      return (
        <Badge className="bg-red-100 text-red-800">
          +{percentChange}% (+{formatPrice(change)})
        </Badge>
      )
    }
    return <Badge variant="outline">No change</Badge>
  }

  // Calculate total change from first to current price
  const calculateTotalChange = () => {
    if (history.length === 0) return null
    const firstPrice = history[0].price
    const change = currentPrice - firstPrice
    const percentChange = ((change / firstPrice) * 100).toFixed(1)
    return { change, percentChange }
  }

  const totalChange = calculateTotalChange()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5" />
          Price History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No price history available
          </p>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            {totalChange && history.length > 1 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Since listing</p>
                <div className="flex items-center gap-2">
                  {totalChange.change < 0 ? (
                    <TrendingDown className="h-5 w-5 text-green-600" />
                  ) : totalChange.change > 0 ? (
                    <TrendingUp className="h-5 w-5 text-red-600" />
                  ) : (
                    <Minus className="h-5 w-5 text-gray-400" />
                  )}
                  <span className={`font-semibold ${
                    totalChange.change < 0 ? 'text-green-600' :
                    totalChange.change > 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {totalChange.change > 0 ? '+' : ''}{totalChange.percentChange}%
                  </span>
                  <span className="text-sm text-gray-500">
                    ({totalChange.change > 0 ? '+' : ''}{formatPrice(totalChange.change)})
                  </span>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-3">
                {/* Current Price (always show first) */}
                <div className="flex items-start gap-3 relative">
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center z-10">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-blue-600">{formatPrice(currentPrice)}</p>
                      <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>

                {/* Historical entries */}
                {[...history].reverse().map((entry, index, arr) => {
                  const prevEntry = arr[index + 1]
                  return (
                    <div key={entry.id} className="flex items-start gap-3 relative">
                      <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center z-10 border border-gray-300">
                        {getChangeIcon(entry.changeType, arr.length - 1 - index)}
                      </div>
                      <div className="flex-1 pb-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="font-medium">{formatPrice(entry.price)}</p>
                          {getChangeBadge(entry, prevEntry?.price)}
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(entry.changedAt)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
