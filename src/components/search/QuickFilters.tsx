"use client"

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, X, Heart, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface QuickFilterValues {
  listingType: 'SALE' | 'RENT' | null
  propertyTypes: string[]
  rooms: number[]
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
}

interface QuickFiltersProps {
  values: QuickFilterValues
  onChange: (values: QuickFilterValues) => void
  onSaveSearch?: () => void
  onMoreFilters?: () => void
  showMoreFilters?: boolean
}

type DropdownType = 'propertyType' | 'rooms' | 'price' | 'area' | null

export function QuickFilters({
  values,
  onChange,
  onSaveSearch,
  onMoreFilters,
  showMoreFilters = true,
}: QuickFiltersProps) {
  const t = useTranslations('quickFilters')
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown]
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const toggleDropdown = (dropdown: DropdownType) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const handleListingTypeChange = (type: 'SALE' | 'RENT') => {
    onChange({
      ...values,
      listingType: values.listingType === type ? null : type,
    })
  }

  const handlePropertyTypeToggle = (type: string) => {
    const newTypes = values.propertyTypes.includes(type)
      ? values.propertyTypes.filter(t => t !== type)
      : [...values.propertyTypes, type]
    onChange({ ...values, propertyTypes: newTypes })
  }

  const handleRoomToggle = (room: number) => {
    const newRooms = values.rooms.includes(room)
      ? values.rooms.filter(r => r !== room)
      : [...values.rooms, room]
    onChange({ ...values, rooms: newRooms })
  }

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value ? parseInt(value.replace(/\D/g, '')) : undefined
    onChange({ ...values, [field]: numValue })
  }

  const handleAreaChange = (field: 'minArea' | 'maxArea', value: string) => {
    const numValue = value ? parseInt(value.replace(/\D/g, '')) : undefined
    onChange({ ...values, [field]: numValue })
  }

  const clearPropertyTypes = () => {
    onChange({ ...values, propertyTypes: [] })
    setOpenDropdown(null)
  }

  const clearRooms = () => {
    onChange({ ...values, rooms: [] })
    setOpenDropdown(null)
  }

  const clearPrice = () => {
    onChange({ ...values, minPrice: undefined, maxPrice: undefined })
    setOpenDropdown(null)
  }

  const clearArea = () => {
    onChange({ ...values, minArea: undefined, maxArea: undefined })
    setOpenDropdown(null)
  }

  const propertyTypes = [
    { value: 'APARTMENT', label: t('propertyTypes.apartment') },
    { value: 'NEW_BUILDING', label: t('propertyTypes.newBuilding') },
    { value: 'HOUSE', label: t('propertyTypes.house') },
    { value: 'TOWNHOUSE', label: t('propertyTypes.townhouse') },
    { value: 'ROOM', label: t('propertyTypes.room') },
    { value: 'LAND', label: t('propertyTypes.land') },
    { value: 'COMMERCIAL', label: t('propertyTypes.commercial') },
  ]

  const roomOptions = [1, 2, 3, 4, 5]

  const formatPrice = (value?: number) => {
    if (!value) return ''
    return value.toLocaleString()
  }

  const getPropertyTypeLabel = () => {
    if (values.propertyTypes.length === 0) return t('propertyType')
    if (values.propertyTypes.length === 1) {
      const type = propertyTypes.find(pt => pt.value === values.propertyTypes[0])
      return type?.label || t('propertyType')
    }
    return `${t('propertyType')} (${values.propertyTypes.length})`
  }

  const getRoomsLabel = () => {
    if (values.rooms.length === 0) return t('rooms')
    if (values.rooms.length === 1) {
      return values.rooms[0] === 5 ? '5+' : `${values.rooms[0]}-${t('room')}`
    }
    return values.rooms.map(r => r === 5 ? '5+' : r).join(', ')
  }

  const getPriceLabel = () => {
    if (!values.minPrice && !values.maxPrice) return t('price')
    if (values.minPrice && values.maxPrice) {
      return `${formatPrice(values.minPrice)} - ${formatPrice(values.maxPrice)}`
    }
    if (values.minPrice) return `${t('from')} ${formatPrice(values.minPrice)}`
    if (values.maxPrice) return `${t('to')} ${formatPrice(values.maxPrice)}`
    return t('price')
  }

  const getAreaLabel = () => {
    if (!values.minArea && !values.maxArea) return t('area')
    if (values.minArea && values.maxArea) {
      return `${values.minArea} - ${values.maxArea} ${t('sqm')}`
    }
    if (values.minArea) return `${t('from')} ${values.minArea} ${t('sqm')}`
    if (values.maxArea) return `${t('to')} ${values.maxArea} ${t('sqm')}`
    return t('area')
  }

  const hasActiveFilters =
    values.propertyTypes.length > 0 ||
    values.rooms.length > 0 ||
    values.minPrice ||
    values.maxPrice ||
    values.minArea ||
    values.maxArea

  return (
    <div className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-3 flex-wrap">
          {/* Buy/Rent Toggle */}
          <div className="flex rounded-lg border overflow-hidden flex-shrink-0">
            <button
              onClick={() => handleListingTypeChange('SALE')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                values.listingType === 'SALE'
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              {t('buy')}
            </button>
            <button
              onClick={() => handleListingTypeChange('RENT')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-l",
                values.listingType === 'RENT'
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              {t('rent')}
            </button>
          </div>

          {/* Property Type Dropdown */}
          <div
            ref={el => { dropdownRefs.current['propertyType'] = el }}
            className="relative flex-shrink-0"
          >
            <button
              onClick={() => toggleDropdown('propertyType')}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm border rounded-lg transition-colors",
                values.propertyTypes.length > 0
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              )}
            >
              <span className="whitespace-nowrap">{getPropertyTypeLabel()}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", openDropdown === 'propertyType' && "rotate-180")} />
            </button>

            {openDropdown === 'propertyType' && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                {propertyTypes.map(type => (
                  <label
                    key={type.value}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={values.propertyTypes.includes(type.value)}
                      onCheckedChange={() => handlePropertyTypeToggle(type.value)}
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
                {values.propertyTypes.length > 0 && (
                  <div className="border-t mt-2 pt-2 px-4">
                    <button
                      onClick={clearPropertyTypes}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {t('clear')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rooms Dropdown */}
          <div
            ref={el => { dropdownRefs.current['rooms'] = el }}
            className="relative flex-shrink-0"
          >
            <button
              onClick={() => toggleDropdown('rooms')}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm border rounded-lg transition-colors",
                values.rooms.length > 0
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              )}
            >
              <span className="whitespace-nowrap">{getRoomsLabel()}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", openDropdown === 'rooms' && "rotate-180")} />
            </button>

            {openDropdown === 'rooms' && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                {roomOptions.map(room => (
                  <label
                    key={room}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={values.rooms.includes(room)}
                      onCheckedChange={() => handleRoomToggle(room)}
                    />
                    <span className="text-sm">
                      {room === 5 ? `5+ ${t('rooms')}` : `${room}-${t('room')}`}
                    </span>
                  </label>
                ))}
                {values.rooms.length > 0 && (
                  <div className="border-t mt-2 pt-2 px-4">
                    <button
                      onClick={clearRooms}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {t('clear')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price Dropdown */}
          <div
            ref={el => { dropdownRefs.current['price'] = el }}
            className="relative flex-shrink-0"
          >
            <button
              onClick={() => toggleDropdown('price')}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm border rounded-lg transition-colors",
                (values.minPrice || values.maxPrice)
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              )}
            >
              <span className="whitespace-nowrap">{getPriceLabel()}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", openDropdown === 'price' && "rotate-180")} />
            </button>

            {openDropdown === 'price' && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-4 min-w-[280px] z-50">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">{t('from')}</label>
                    <Input
                      type="text"
                      placeholder="0"
                      value={formatPrice(values.minPrice)}
                      onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <span className="text-gray-400 mt-5">—</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">{t('to')}</label>
                    <Input
                      type="text"
                      placeholder={t('any')}
                      value={formatPrice(values.maxPrice)}
                      onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                {(values.minPrice || values.maxPrice) && (
                  <button
                    onClick={clearPrice}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-3"
                  >
                    {t('clear')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Area Dropdown */}
          <div
            ref={el => { dropdownRefs.current['area'] = el }}
            className="relative flex-shrink-0"
          >
            <button
              onClick={() => toggleDropdown('area')}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm border rounded-lg transition-colors",
                (values.minArea || values.maxArea)
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              )}
            >
              <span className="whitespace-nowrap">{getAreaLabel()}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", openDropdown === 'area' && "rotate-180")} />
            </button>

            {openDropdown === 'area' && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-4 min-w-[280px] z-50">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">{t('from')}</label>
                    <Input
                      type="text"
                      placeholder="0"
                      value={values.minArea || ''}
                      onChange={(e) => handleAreaChange('minArea', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <span className="text-gray-400 mt-5">—</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">{t('to')}</label>
                    <Input
                      type="text"
                      placeholder={t('any')}
                      value={values.maxArea || ''}
                      onChange={(e) => handleAreaChange('maxArea', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{t('sqm')}</p>
                {(values.minArea || values.maxArea) && (
                  <button
                    onClick={clearArea}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                  >
                    {t('clear')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* More Filters Button */}
          {showMoreFilters && onMoreFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMoreFilters}
              className="flex-shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              {t('moreFilters')}
            </Button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Save Search Button */}
          {onSaveSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSaveSearch}
              className="flex-shrink-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Heart className="h-4 w-4 mr-1" />
              {t('saveSearch')}
            </Button>
          )}
        </div>

        {/* Active filters summary - shown on mobile when scrolled */}
        {hasActiveFilters && (
          <div className="pb-2 flex items-center gap-2 text-xs text-gray-500">
            <span>{t('activeFilters')}:</span>
            {values.propertyTypes.length > 0 && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {values.propertyTypes.length} {t('types')}
              </span>
            )}
            {values.rooms.length > 0 && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {values.rooms.join(', ')} {t('rooms')}
              </span>
            )}
            {(values.minPrice || values.maxPrice) && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {t('price')}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
