"use client"

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useComparison } from '@/contexts/ComparisonContext'
import { Button } from '@/components/ui/button'
import { X, ArrowRight, Layers } from 'lucide-react'

export function ComparisonBar() {
  const t = useTranslations('compare')
  const { properties, removeFromComparison, clearComparison, maxProperties } = useComparison()

  if (properties.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 animate-in slide-in-from-bottom-2">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Icon and title */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Layers className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">{t('comparing')}</p>
              <p className="text-xs text-gray-500">
                {properties.length} / {maxProperties} {t('propertiesSelected')}
              </p>
            </div>
          </div>

          {/* Center: Property thumbnails */}
          <div className="flex items-center gap-2 flex-1 justify-center overflow-x-auto max-w-xl">
            {properties.map((property) => (
              <div
                key={property.id}
                className="relative group flex-shrink-0"
              >
                <div className="relative h-12 w-16 rounded overflow-hidden">
                  <Image
                    src={property.images[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFromComparison(property.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: maxProperties - properties.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-12 w-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400"
              >
                <span className="text-xs">+</span>
              </div>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearComparison}
            >
              {t('clear')}
            </Button>
            <Link href="/compare">
              <Button size="sm" disabled={properties.length < 2}>
                {t('compare')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
