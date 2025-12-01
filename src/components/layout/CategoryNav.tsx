"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronDown, Home, Building2, Building, TreePine, DoorOpen } from 'lucide-react'

interface CategoryItem {
  key: string
  icon: React.ReactNode
  href: string
}

const saleCategories: CategoryItem[] = [
  { key: 'apartments', icon: <Building2 className="h-4 w-4" />, href: '/properties?listingType=SALE&propertyType=APARTMENT' },
  { key: 'houses', icon: <Home className="h-4 w-4" />, href: '/properties?listingType=SALE&propertyType=HOUSE' },
  { key: 'newBuildings', icon: <Building className="h-4 w-4" />, href: '/properties?listingType=SALE&propertyType=NEW_BUILDING' },
  { key: 'townhouses', icon: <Home className="h-4 w-4" />, href: '/properties?listingType=SALE&propertyType=TOWNHOUSE' },
  { key: 'land', icon: <TreePine className="h-4 w-4" />, href: '/properties?listingType=SALE&propertyType=LAND' },
]

const rentCategories: CategoryItem[] = [
  { key: 'apartments', icon: <Building2 className="h-4 w-4" />, href: '/properties?listingType=RENT&propertyType=APARTMENT' },
  { key: 'houses', icon: <Home className="h-4 w-4" />, href: '/properties?listingType=RENT&propertyType=HOUSE' },
  { key: 'rooms', icon: <DoorOpen className="h-4 w-4" />, href: '/properties?listingType=RENT&propertyType=ROOM' },
]

export function CategoryNav() {
  const t = useTranslations('categoryNav')
  const [openMenu, setOpenMenu] = useState<'sale' | 'rent' | null>(null)

  return (
    <nav className="bg-white border-b hidden md:block">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 h-12">
          {/* Sale Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu('sale')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-3">
              <span>{t('sale')}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === 'sale' ? 'rotate-180' : ''}`} />
            </button>

            {openMenu === 'sale' && (
              <div className="absolute top-full left-0 bg-white border rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                {saleCategories.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    onClick={() => setOpenMenu(null)}
                  >
                    {item.icon}
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Rent Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu('rent')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-3">
              <span>{t('rent')}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === 'rent' ? 'rotate-180' : ''}`} />
            </button>

            {openMenu === 'rent' && (
              <div className="absolute top-full left-0 bg-white border rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                {rentCategories.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    onClick={() => setOpenMenu(null)}
                  >
                    {item.icon}
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Direct Links */}
          <Link
            href="/agents"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            {t('agents')}
          </Link>
        </div>
      </div>
    </nav>
  )
}
