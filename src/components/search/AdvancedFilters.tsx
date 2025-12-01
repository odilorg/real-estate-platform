"use client"

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SlidersHorizontal, X, MapPin } from 'lucide-react'
import {
  regions,
  getCitiesByRegion,
  getDistrictsByCity,
  getLocalizedName,
  type City,
  type District,
} from '@/lib/locations'

export interface AdvancedFilterValues {
  propertyTypes: string[]
  listingTypes: string[]
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
  minArea?: number
  maxArea?: number
  amenities: string[]
  city?: string
  state?: string
  district?: string
  latitude?: number
  longitude?: number
  radius?: number // in miles
  // Enhanced CIAN-style filters
  buildingClasses: string[]
  renovationTypes: string[]
  maxMetroDistance?: number
  minPricePerSqFt?: number
  maxPricePerSqFt?: number
  minYearBuilt?: number
  maxYearBuilt?: number
  minFloor?: number
  maxFloor?: number
  parkingTypes: string[]
  hasBalcony?: boolean
  hasConcierge?: boolean
  hasGatedArea?: boolean
}

interface AdvancedFiltersProps {
  values: AdvancedFilterValues
  onChange: (values: AdvancedFilterValues) => void
  onApply: () => void
  onReset: () => void
}

const PROPERTY_TYPE_KEYS = ['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'VILLA', 'STUDIO', 'COMMERCIAL', 'LAND'] as const
const LISTING_TYPE_KEYS = ['SALE', 'RENT'] as const
const AMENITY_KEYS = ['PARKING', 'GARAGE', 'GARDEN', 'POOL', 'GYM', 'ELEVATOR', 'SECURITY', 'AIR_CONDITIONING', 'HEATING', 'BALCONY', 'FIREPLACE', 'PET_FRIENDLY'] as const
const BUILDING_CLASS_KEYS = ['ECONOMY', 'COMFORT', 'BUSINESS', 'ELITE'] as const
const RENOVATION_TYPE_KEYS = ['NONE', 'COSMETIC', 'EURO', 'DESIGNER', 'NEEDS_RENOVATION'] as const
const PARKING_TYPE_KEYS = ['STREET', 'GARAGE', 'UNDERGROUND', 'COVERED', 'OPEN'] as const
const METRO_DISTANCE_VALUES = [5, 10, 15, 20, 30] as const

export function AdvancedFilters({
  values,
  onChange,
  onApply,
  onReset,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const locale = useLocale()
  const t = useTranslations('properties')
  const tCommon = useTranslations('common')
  const tAmenities = useTranslations('amenities')

  // Location select states
  const [selectedRegionId, setSelectedRegionId] = useState<string>('')
  const [selectedCityId, setSelectedCityId] = useState<string>('')
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('')
  const [availableCities, setAvailableCities] = useState<City[]>([])
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([])

  // Location change handlers
  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId)
    setSelectedCityId('')
    setSelectedDistrictId('')
    setAvailableDistricts([])

    const cities = getCitiesByRegion(regionId)
    setAvailableCities(cities)

    const region = regions.find(r => r.id === regionId)
    if (region) {
      updateValue('state', getLocalizedName(region, locale))
    }
    updateValue('city', undefined)
    updateValue('district', undefined)
  }

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId)
    setSelectedDistrictId('')

    const districts = getDistrictsByCity(selectedRegionId, cityId)
    setAvailableDistricts(districts)

    const city = availableCities.find(c => c.id === cityId)
    if (city) {
      updateValue('city', getLocalizedName(city, locale))
    }
    updateValue('district', undefined)
  }

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId)

    const district = availableDistricts.find(d => d.id === districtId)
    if (district) {
      updateValue('district', getLocalizedName(district, locale))
    }
  }

  const handleClearLocation = () => {
    setSelectedRegionId('')
    setSelectedCityId('')
    setSelectedDistrictId('')
    setAvailableCities([])
    setAvailableDistricts([])
    updateValue('state', undefined)
    updateValue('city', undefined)
    updateValue('district', undefined)
  }

  const updateValue = (key: keyof AdvancedFilterValues, value: any) => {
    onChange({ ...values, [key]: value })
  }

  const toggleArrayValue = (key: 'propertyTypes' | 'listingTypes' | 'amenities' | 'buildingClasses' | 'renovationTypes' | 'parkingTypes', value: string) => {
    const current = values[key] || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateValue(key, updated)
  }

  const hasActiveFilters = () => {
    return (
      values.propertyTypes.length > 0 ||
      values.listingTypes.length > 0 ||
      values.amenities.length > 0 ||
      (values.buildingClasses?.length || 0) > 0 ||
      (values.renovationTypes?.length || 0) > 0 ||
      (values.parkingTypes?.length || 0) > 0 ||
      values.minPrice !== undefined ||
      values.maxPrice !== undefined ||
      values.minBedrooms !== undefined ||
      values.maxBedrooms !== undefined ||
      values.minBathrooms !== undefined ||
      values.maxBathrooms !== undefined ||
      values.minArea !== undefined ||
      values.maxArea !== undefined ||
      values.maxMetroDistance !== undefined ||
      values.minPricePerSqFt !== undefined ||
      values.maxPricePerSqFt !== undefined ||
      values.minYearBuilt !== undefined ||
      values.maxYearBuilt !== undefined ||
      values.minFloor !== undefined ||
      values.maxFloor !== undefined ||
      values.hasBalcony !== undefined ||
      values.hasConcierge !== undefined ||
      values.hasGatedArea !== undefined ||
      values.city ||
      values.state ||
      values.district
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            {t('advancedFilters.title')}
            {hasActiveFilters() && (
              <span className="text-sm font-normal text-blue-600">
                ({t('advancedFilters.active')})
              </span>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t('advancedFilters.hide') : t('advancedFilters.show')}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Property Type */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.propertyType')}</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PROPERTY_TYPE_KEYS.map((typeKey) => (
                <div key={typeKey} className="flex items-center space-x-2">
                  <Checkbox
                    id={`prop-${typeKey}`}
                    checked={values.propertyTypes.includes(typeKey)}
                    onCheckedChange={() => toggleArrayValue('propertyTypes', typeKey)}
                  />
                  <label
                    htmlFor={`prop-${typeKey}`}
                    className="text-sm cursor-pointer"
                  >
                    {t(`types.${typeKey.toLowerCase()}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Listing Type */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.listingType')}</Label>
            <div className="flex gap-4">
              {LISTING_TYPE_KEYS.map((typeKey) => (
                <div key={typeKey} className="flex items-center space-x-2">
                  <Checkbox
                    id={`list-${typeKey}`}
                    checked={values.listingTypes.includes(typeKey)}
                    onCheckedChange={() => toggleArrayValue('listingTypes', typeKey)}
                  />
                  <label
                    htmlFor={`list-${typeKey}`}
                    className="text-sm cursor-pointer"
                  >
                    {t(`listingTypes.${typeKey.toLowerCase()}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.priceRange')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPrice" className="text-xs text-gray-600">
                  {t('filters.minPrice')}
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="$0"
                  value={values.minPrice || ''}
                  onChange={(e) =>
                    updateValue('minPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Label htmlFor="maxPrice" className="text-xs text-gray-600">
                  {t('filters.maxPrice')}
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder={tCommon('any')}
                  value={values.maxPrice || ''}
                  onChange={(e) =>
                    updateValue('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.bedrooms')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minBedrooms" className="text-xs text-gray-600">
                  {t('filters.minBeds')}
                </Label>
                <Select
                  value={values.minBedrooms?.toString()}
                  onValueChange={(val) => updateValue('minBedrooms', val ? Number(val) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tCommon('any')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{tCommon('any')}</SelectItem>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxBedrooms" className="text-xs text-gray-600">
                  {t('filters.maxBeds')}
                </Label>
                <Select
                  value={values.maxBedrooms?.toString()}
                  onValueChange={(val) => updateValue('maxBedrooms', val ? Number(val) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tCommon('any')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{tCommon('any')}</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.bathrooms')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minBathrooms" className="text-xs text-gray-600">
                  {t('filters.minBaths')}
                </Label>
                <Select
                  value={values.minBathrooms?.toString()}
                  onValueChange={(val) =>
                    updateValue('minBathrooms', val ? Number(val) : undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tCommon('any')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{tCommon('any')}</SelectItem>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxBathrooms" className="text-xs text-gray-600">
                  {t('filters.maxBaths')}
                </Label>
                <Select
                  value={values.maxBathrooms?.toString()}
                  onValueChange={(val) =>
                    updateValue('maxBathrooms', val ? Number(val) : undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tCommon('any')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{tCommon('any')}</SelectItem>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Square Footage */}
          <div>
            <Label className="text-base mb-3 block">{t('advancedFilters.squareFootage')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minArea" className="text-xs text-gray-600">
                  {t('filters.minArea')}
                </Label>
                <Input
                  id="minArea"
                  type="number"
                  placeholder="0"
                  value={values.minArea || ''}
                  onChange={(e) =>
                    updateValue('minArea', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Label htmlFor="maxArea" className="text-xs text-gray-600">
                  {t('filters.maxArea')}
                </Label>
                <Input
                  id="maxArea"
                  type="number"
                  placeholder={tCommon('any')}
                  value={values.maxArea || ''}
                  onChange={(e) =>
                    updateValue('maxArea', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
          </div>

          {/* Price per Sq Ft */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.pricePerSqFt')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPricePerSqFt" className="text-xs text-gray-600">
                  {tCommon('min')} $/м²
                </Label>
                <Input
                  id="minPricePerSqFt"
                  type="number"
                  placeholder="$0"
                  value={values.minPricePerSqFt || ''}
                  onChange={(e) =>
                    updateValue('minPricePerSqFt', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Label htmlFor="maxPricePerSqFt" className="text-xs text-gray-600">
                  {tCommon('max')} $/м²
                </Label>
                <Input
                  id="maxPricePerSqFt"
                  type="number"
                  placeholder={tCommon('any')}
                  value={values.maxPricePerSqFt || ''}
                  onChange={(e) =>
                    updateValue('maxPricePerSqFt', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
          </div>

          {/* Building Class */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.buildingClass')}</Label>
            <div className="flex flex-wrap gap-2">
              {BUILDING_CLASS_KEYS.map((classKey) => (
                <div key={classKey} className="flex items-center space-x-2">
                  <Checkbox
                    id={`class-${classKey}`}
                    checked={(values.buildingClasses || []).includes(classKey)}
                    onCheckedChange={() => toggleArrayValue('buildingClasses', classKey)}
                  />
                  <label
                    htmlFor={`class-${classKey}`}
                    className="text-sm cursor-pointer"
                  >
                    {t(`buildingClasses.${classKey.toLowerCase()}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Renovation Type */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.renovation')}</Label>
            <div className="flex flex-wrap gap-2">
              {RENOVATION_TYPE_KEYS.map((typeKey) => (
                <div key={typeKey} className="flex items-center space-x-2">
                  <Checkbox
                    id={`reno-${typeKey}`}
                    checked={(values.renovationTypes || []).includes(typeKey)}
                    onCheckedChange={() => toggleArrayValue('renovationTypes', typeKey)}
                  />
                  <label
                    htmlFor={`reno-${typeKey}`}
                    className="text-sm cursor-pointer"
                  >
                    {t(`renovationTypes.${typeKey.toLowerCase()}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Metro Distance */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.metroDistance')}</Label>
            <Select
              value={values.maxMetroDistance?.toString()}
              onValueChange={(val) => updateValue('maxMetroDistance', val && val !== '0' ? Number(val) : undefined)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('metroDistances.anyDistance')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t('metroDistances.anyDistance')}</SelectItem>
                {METRO_DISTANCE_VALUES.map((dist) => (
                  <SelectItem key={dist} value={dist.toString()}>
                    {t('metroDistances.within')} {t(`metroDistances.walking${dist}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Built */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.yearBuilt')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minYearBuilt" className="text-xs text-gray-600">
                  {tCommon('from')}
                </Label>
                <Input
                  id="minYearBuilt"
                  type="number"
                  placeholder="1900"
                  value={values.minYearBuilt || ''}
                  onChange={(e) =>
                    updateValue('minYearBuilt', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Label htmlFor="maxYearBuilt" className="text-xs text-gray-600">
                  {tCommon('to')}
                </Label>
                <Input
                  id="maxYearBuilt"
                  type="number"
                  placeholder={new Date().getFullYear().toString()}
                  value={values.maxYearBuilt || ''}
                  onChange={(e) =>
                    updateValue('maxYearBuilt', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
          </div>

          {/* Floor Range */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.floor')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minFloor" className="text-xs text-gray-600">
                  {t('filters.minFloor')}
                </Label>
                <Select
                  value={values.minFloor?.toString()}
                  onValueChange={(val) => updateValue('minFloor', val && val !== '0' ? Number(val) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tCommon('any')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{tCommon('any')}</SelectItem>
                    <SelectItem value="2">{t('advancedFilters.notFirstFloor')}</SelectItem>
                    {[1, 2, 3, 5, 10, 15, 20].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxFloor" className="text-xs text-gray-600">
                  {t('filters.maxFloor')}
                </Label>
                <Select
                  value={values.maxFloor?.toString()}
                  onValueChange={(val) => updateValue('maxFloor', val && val !== '0' ? Number(val) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tCommon('any')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{tCommon('any')}</SelectItem>
                    {[3, 5, 10, 15, 20, 30, 50].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {t('advancedFilters.upTo')} {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Parking Type */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.parking')}</Label>
            <div className="flex flex-wrap gap-2">
              {PARKING_TYPE_KEYS.map((typeKey) => (
                <div key={typeKey} className="flex items-center space-x-2">
                  <Checkbox
                    id={`parking-${typeKey}`}
                    checked={(values.parkingTypes || []).includes(typeKey)}
                    onCheckedChange={() => toggleArrayValue('parkingTypes', typeKey)}
                  />
                  <label
                    htmlFor={`parking-${typeKey}`}
                    className="text-sm cursor-pointer"
                  >
                    {t(`parkingTypes.${typeKey.toLowerCase()}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Building Features */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.features')}</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasBalcony"
                  checked={values.hasBalcony === true}
                  onCheckedChange={(checked) => updateValue('hasBalcony', checked ? true : undefined)}
                />
                <label htmlFor="hasBalcony" className="text-sm cursor-pointer">
                  {t('filters.balcony')}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasConcierge"
                  checked={values.hasConcierge === true}
                  onCheckedChange={(checked) => updateValue('hasConcierge', checked ? true : undefined)}
                />
                <label htmlFor="hasConcierge" className="text-sm cursor-pointer">
                  {t('filters.concierge')}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasGatedArea"
                  checked={values.hasGatedArea === true}
                  onCheckedChange={(checked) => updateValue('hasGatedArea', checked ? true : undefined)}
                />
                <label htmlFor="hasGatedArea" className="text-sm cursor-pointer">
                  {t('filters.gatedArea')}
                </label>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label className="text-base mb-3 block">{t('filters.amenities')}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AMENITY_KEYS.map((amenityKey) => (
                <div key={amenityKey} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenityKey}`}
                    checked={values.amenities.includes(amenityKey)}
                    onCheckedChange={() => toggleArrayValue('amenities', amenityKey)}
                  />
                  <label
                    htmlFor={`amenity-${amenityKey}`}
                    className="text-sm cursor-pointer"
                  >
                    {tAmenities(amenityKey.toLowerCase().replace('_', ''))}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('advancedFilters.location')}
              </Label>
              {(selectedRegionId || values.state || values.city || values.district) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearLocation}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {tCommon('clear')}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="state" className="text-xs text-gray-600">
                  {t('form.state')}
                </Label>
                <Select
                  value={selectedRegionId}
                  onValueChange={handleRegionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.selectRegion')} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={region.id}>
                        {getLocalizedName(region, locale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city" className="text-xs text-gray-600">
                  {t('form.city')}
                </Label>
                <Select
                  value={selectedCityId}
                  onValueChange={handleCityChange}
                  disabled={!selectedRegionId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedRegionId ? t('form.selectCity') : t('form.selectRegionFirst')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map(city => (
                      <SelectItem key={city.id} value={city.id}>
                        {getLocalizedName(city, locale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="district" className="text-xs text-gray-600">
                  {t('form.district')}
                </Label>
                <Select
                  value={selectedDistrictId}
                  onValueChange={handleDistrictChange}
                  disabled={!selectedCityId || availableDistricts.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedCityId ? t('form.selectDistrict') : t('form.selectCityFirst')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map(district => (
                      <SelectItem key={district.id} value={district.id}>
                        {getLocalizedName(district, locale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Radius Search */}
          <div>
            <Label className="text-base mb-3 block">{t('advancedFilters.searchRadius')}</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-xs text-gray-600">
                  {t('advancedFilters.latitude')}
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  placeholder="41.2995"
                  value={values.latitude || ''}
                  onChange={(e) =>
                    updateValue('latitude', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Label htmlFor="longitude" className="text-xs text-gray-600">
                  {t('advancedFilters.longitude')}
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  placeholder="69.2401"
                  value={values.longitude || ''}
                  onChange={(e) =>
                    updateValue('longitude', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Label htmlFor="radius" className="text-xs text-gray-600">
                  {t('advancedFilters.radiusMiles')}
                </Label>
                <Input
                  id="radius"
                  type="number"
                  placeholder="10"
                  value={values.radius || ''}
                  onChange={(e) =>
                    updateValue('radius', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {t('advancedFilters.radiusHelp')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onApply} className="flex-1">
              {t('advancedFilters.applyFilters')}
            </Button>
            <Button variant="outline" onClick={onReset}>
              <X className="h-4 w-4 mr-2" />
              {tCommon('reset')}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
