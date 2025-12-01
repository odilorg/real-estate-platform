"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface MoreFiltersValues {
  // Property type
  propertyCondition: 'any' | 'new' | 'resale' | null

  // Rooms
  rooms: (string | number)[]

  // Price
  minPrice?: number
  maxPrice?: number
  priceType: 'total' | 'perSqm'

  // Area
  minArea?: number
  maxArea?: number
  minKitchenArea?: number
  maxKitchenArea?: number
  minLivingArea?: number
  maxLivingArea?: number

  // Metro
  maxMetroDistance?: number
  metroTransport: 'walk' | 'transport'

  // Floor
  minFloor?: number
  maxFloor?: number
  notFirstFloor: boolean
  notLastFloor: boolean
  onlyLastFloor: boolean

  // Building floors
  minBuildingFloors?: number
  maxBuildingFloors?: number

  // Balcony
  balcony: 'any' | 'balcony' | 'loggia' | null

  // Year built
  minYearBuilt?: number
  maxYearBuilt?: number

  // Amenities
  hasParking: boolean
  hasFurniture: boolean
  hasRenovation: boolean
}

interface MoreFiltersModalProps {
  isOpen: boolean
  onClose: () => void
  values: MoreFiltersValues
  onChange: (values: MoreFiltersValues) => void
  onApply: () => void
  onReset: () => void
  resultsCount?: number
}

const defaultValues: MoreFiltersValues = {
  propertyCondition: null,
  rooms: [],
  priceType: 'total',
  metroTransport: 'walk',
  notFirstFloor: false,
  notLastFloor: false,
  onlyLastFloor: false,
  balcony: null,
  hasParking: false,
  hasFurniture: false,
  hasRenovation: false,
}

export function MoreFiltersModal({
  isOpen,
  onClose,
  values,
  onChange,
  onApply,
  onReset,
  resultsCount,
}: MoreFiltersModalProps) {
  const t = useTranslations('moreFilters')

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleRoomToggle = (room: string | number) => {
    const newRooms = values.rooms.includes(room)
      ? values.rooms.filter(r => r !== room)
      : [...values.rooms, room]
    onChange({ ...values, rooms: newRooms })
  }

  const roomOptions = ['studio', 1, 2, 3, 4, 5, '6+', 'openPlan']

  const ToggleButton = ({
    active,
    onClick,
    children
  }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm border rounded-lg transition-colors",
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
      )}
    >
      {children}
    </button>
  )

  const RangeInputs = ({
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
    minPlaceholder = t('from'),
    maxPlaceholder = t('to'),
  }: {
    minValue?: number
    maxValue?: number
    onMinChange: (value?: number) => void
    onMaxChange: (value?: number) => void
    minPlaceholder?: string
    maxPlaceholder?: string
  }) => (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder={minPlaceholder}
        value={minValue || ''}
        onChange={(e) => onMinChange(e.target.value ? parseInt(e.target.value) : undefined)}
        className="w-24 h-9"
      />
      <Input
        type="number"
        placeholder={maxPlaceholder}
        value={maxValue || ''}
        onChange={(e) => onMaxChange(e.target.value ? parseInt(e.target.value) : undefined)}
        className="w-24 h-9"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{t('title')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Property Condition */}
          <div className="flex items-start gap-8">
            <label className="w-32 text-sm text-gray-600 pt-2 flex-shrink-0">
              {t('propertyCondition')}
            </label>
            <div className="flex flex-wrap gap-2">
              <ToggleButton
                active={values.propertyCondition === null}
                onClick={() => onChange({ ...values, propertyCondition: null })}
              >
                {t('any')}
              </ToggleButton>
              <ToggleButton
                active={values.propertyCondition === 'new'}
                onClick={() => onChange({ ...values, propertyCondition: 'new' })}
              >
                {t('newBuilding')}
              </ToggleButton>
              <ToggleButton
                active={values.propertyCondition === 'resale'}
                onClick={() => onChange({ ...values, propertyCondition: 'resale' })}
              >
                {t('resale')}
              </ToggleButton>
            </div>
          </div>

          {/* Rooms */}
          <div className="flex items-start gap-8">
            <label className="w-32 text-sm text-gray-600 pt-2 flex-shrink-0">
              {t('rooms')}
            </label>
            <div className="flex flex-wrap gap-2">
              {roomOptions.map((room) => (
                <ToggleButton
                  key={room}
                  active={values.rooms.includes(room)}
                  onClick={() => handleRoomToggle(room)}
                >
                  {room === 'studio' ? t('studio') : room === 'openPlan' ? t('openPlan') : room}
                </ToggleButton>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-start gap-8">
            <label className="w-32 text-sm text-gray-600 pt-2 flex-shrink-0">
              {t('price')}
            </label>
            <div className="flex items-center gap-4">
              <RangeInputs
                minValue={values.minPrice}
                maxValue={values.maxPrice}
                onMinChange={(v) => onChange({ ...values, minPrice: v })}
                onMaxChange={(v) => onChange({ ...values, maxPrice: v })}
              />
              <div className="flex gap-1">
                <ToggleButton
                  active={values.priceType === 'total'}
                  onClick={() => onChange({ ...values, priceType: 'total' })}
                >
                  {t('totalPrice')}
                </ToggleButton>
                <ToggleButton
                  active={values.priceType === 'perSqm'}
                  onClick={() => onChange({ ...values, priceType: 'perSqm' })}
                >
                  {t('pricePerSqm')}
                </ToggleButton>
              </div>
            </div>
          </div>

          {/* Area */}
          <div className="flex items-start gap-8">
            <label className="w-32 text-sm text-gray-600 pt-2 flex-shrink-0">
              {t('area')}
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-16">{t('totalArea')}</span>
                <RangeInputs
                  minValue={values.minArea}
                  maxValue={values.maxArea}
                  onMinChange={(v) => onChange({ ...values, minArea: v })}
                  onMaxChange={(v) => onChange({ ...values, maxArea: v })}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-16">{t('kitchen')}</span>
                <RangeInputs
                  minValue={values.minKitchenArea}
                  maxValue={values.maxKitchenArea}
                  onMinChange={(v) => onChange({ ...values, minKitchenArea: v })}
                  onMaxChange={(v) => onChange({ ...values, maxKitchenArea: v })}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-16">{t('living')}</span>
                <RangeInputs
                  minValue={values.minLivingArea}
                  maxValue={values.maxLivingArea}
                  onMinChange={(v) => onChange({ ...values, minLivingArea: v })}
                  onMaxChange={(v) => onChange({ ...values, maxLivingArea: v })}
                />
              </div>
            </div>
          </div>

          {/* Metro Distance */}
          <div className="flex items-start gap-8">
            <label className="w-32 text-sm text-gray-600 pt-2 flex-shrink-0">
              {t('metroDistance')}
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{t('noMoreThan')}</span>
              <Input
                type="number"
                value={values.maxMetroDistance || ''}
                onChange={(e) => onChange({ ...values, maxMetroDistance: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-20 h-9"
              />
              <span className="text-sm text-gray-500">{t('minutes')}</span>
              <div className="flex gap-1 ml-2">
                <ToggleButton
                  active={values.metroTransport === 'walk'}
                  onClick={() => onChange({ ...values, metroTransport: 'walk' })}
                >
                  {t('onFoot')}
                </ToggleButton>
                <ToggleButton
                  active={values.metroTransport === 'transport'}
                  onClick={() => onChange({ ...values, metroTransport: 'transport' })}
                >
                  {t('byTransport')}
                </ToggleButton>
              </div>
            </div>
          </div>

          {/* Floor */}
          <div className="flex items-start gap-8">
            <label className="w-32 text-sm text-gray-600 pt-2 flex-shrink-0">
              {t('floor')}
            </label>
            <div className="flex items-center gap-4">
              <RangeInputs
                minValue={values.minFloor}
                maxValue={values.maxFloor}
                onMinChange={(v) => onChange({ ...values, minFloor: v })}
                onMaxChange={(v) => onChange({ ...values, maxFloor: v })}
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={values.notFirstFloor}
                    onCheckedChange={(checked) => onChange({ ...values, notFirstFloor: !!checked })}
                  />
                  <span className="text-sm">{t('notFirst')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={values.notLastFloor}
                    onCheckedChange={(checked) => onChange({ ...values, notLastFloor: !!checked })}
                  />
                  <span className="text-sm">{t('notLast')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={values.onlyLastFloor}
                    onCheckedChange={(checked) => onChange({ ...values, onlyLastFloor: !!checked })}
                  />
                  <span className="text-sm">{t('onlyLast')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Building Floors */}
          <div className="flex items-start gap-8">
            <label className="w-32 text-sm text-gray-600 pt-2 flex-shrink-0">
              {t('buildingFloors')}
            </label>
            <RangeInputs
              minValue={values.minBuildingFloors}
              maxValue={values.maxBuildingFloors}
              onMinChange={(v) => onChange({ ...values, minBuildingFloors: v })}
              onMaxChange={(v) => onChange({ ...values, maxBuildingFloors: v })}
            />
          </div>

          {/* Balcony */}
          <div className="flex items-start gap-8">
            <label className="w-32 text-sm text-gray-600 pt-2 flex-shrink-0">
              {t('balcony')}
            </label>
            <div className="flex gap-2">
              <ToggleButton
                active={values.balcony === null}
                onClick={() => onChange({ ...values, balcony: null })}
              >
                {t('any')}
              </ToggleButton>
              <ToggleButton
                active={values.balcony === 'balcony'}
                onClick={() => onChange({ ...values, balcony: 'balcony' })}
              >
                {t('hasBalcony')}
              </ToggleButton>
              <ToggleButton
                active={values.balcony === 'loggia'}
                onClick={() => onChange({ ...values, balcony: 'loggia' })}
              >
                {t('hasLoggia')}
              </ToggleButton>
            </div>
          </div>

          {/* Year Built */}
          <div className="flex items-start gap-8">
            <label className="w-32 text-sm text-gray-600 pt-2 flex-shrink-0">
              {t('yearBuilt')}
            </label>
            <RangeInputs
              minValue={values.minYearBuilt}
              maxValue={values.maxYearBuilt}
              onMinChange={(v) => onChange({ ...values, minYearBuilt: v })}
              onMaxChange={(v) => onChange({ ...values, maxYearBuilt: v })}
            />
          </div>

          {/* Amenities */}
          <div className="flex items-start gap-8">
            <label className="w-32 text-sm text-gray-600 pt-2 flex-shrink-0">
              {t('amenities')}
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={values.hasParking}
                  onCheckedChange={(checked) => onChange({ ...values, hasParking: !!checked })}
                />
                <span className="text-sm">{t('parking')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={values.hasFurniture}
                  onCheckedChange={(checked) => onChange({ ...values, hasFurniture: !!checked })}
                />
                <span className="text-sm">{t('furniture')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={values.hasRenovation}
                  onCheckedChange={(checked) => onChange({ ...values, hasRenovation: !!checked })}
                />
                <span className="text-sm">{t('renovation')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onReset}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {t('resetFilters')}
          </button>
          <Button onClick={onApply} size="lg">
            {t('showResults', { count: resultsCount?.toLocaleString() || '...' })}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { defaultValues as defaultMoreFiltersValues }
