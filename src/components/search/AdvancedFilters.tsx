"use client"

import { useState } from 'react'
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
import { SlidersHorizontal, X } from 'lucide-react'

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

const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' },
]

const LISTING_TYPES = [
  { value: 'SALE', label: 'For Sale' },
  { value: 'RENT', label: 'For Rent' },
]

const AMENITIES = [
  { value: 'PARKING', label: 'Parking' },
  { value: 'GARAGE', label: 'Garage' },
  { value: 'GARDEN', label: 'Garden' },
  { value: 'POOL', label: 'Pool' },
  { value: 'GYM', label: 'Gym' },
  { value: 'ELEVATOR', label: 'Elevator' },
  { value: 'SECURITY', label: 'Security' },
  { value: 'AIR_CONDITIONING', label: 'Air Conditioning' },
  { value: 'HEATING', label: 'Heating' },
  { value: 'BALCONY', label: 'Balcony' },
  { value: 'FIREPLACE', label: 'Fireplace' },
  { value: 'PET_FRIENDLY', label: 'Pet Friendly' },
]

const BUILDING_CLASSES = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'COMFORT', label: 'Comfort' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'ELITE', label: 'Elite/Premium' },
]

const RENOVATION_TYPES = [
  { value: 'NONE', label: 'No Renovation' },
  { value: 'COSMETIC', label: 'Cosmetic' },
  { value: 'EURO', label: 'Euro-style' },
  { value: 'DESIGNER', label: 'Designer' },
  { value: 'NEEDS_RENOVATION', label: 'Needs Renovation' },
]

const PARKING_TYPES = [
  { value: 'STREET', label: 'Street Parking' },
  { value: 'GARAGE', label: 'Garage' },
  { value: 'UNDERGROUND', label: 'Underground' },
  { value: 'COVERED', label: 'Covered' },
  { value: 'OPEN', label: 'Open Lot' },
]

const METRO_DISTANCES = [
  { value: 5, label: '5 min walk' },
  { value: 10, label: '10 min walk' },
  { value: 15, label: '15 min walk' },
  { value: 20, label: '20 min walk' },
  { value: 30, label: '30 min walk' },
]

export function AdvancedFilters({
  values,
  onChange,
  onApply,
  onReset,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
      values.state
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Advanced Filters
            {hasActiveFilters() && (
              <span className="text-sm font-normal text-blue-600">
                (Active)
              </span>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Property Type */}
          <div>
            <Label className="text-base mb-3 block">Property Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PROPERTY_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`prop-${type.value}`}
                    checked={values.propertyTypes.includes(type.value)}
                    onCheckedChange={() => toggleArrayValue('propertyTypes', type.value)}
                  />
                  <label
                    htmlFor={`prop-${type.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Listing Type */}
          <div>
            <Label className="text-base mb-3 block">Listing Type</Label>
            <div className="flex gap-4">
              {LISTING_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`list-${type.value}`}
                    checked={values.listingTypes.includes(type.value)}
                    onCheckedChange={() => toggleArrayValue('listingTypes', type.value)}
                  />
                  <label
                    htmlFor={`list-${type.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-base mb-3 block">Price Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPrice" className="text-xs text-gray-600">
                  Min Price
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
                  Max Price
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="Any"
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
            <Label className="text-base mb-3 block">Bedrooms</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minBedrooms" className="text-xs text-gray-600">
                  Min Bedrooms
                </Label>
                <Select
                  value={values.minBedrooms?.toString()}
                  onValueChange={(val) => updateValue('minBedrooms', val ? Number(val) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
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
                  Max Bedrooms
                </Label>
                <Select
                  value={values.maxBedrooms?.toString()}
                  onValueChange={(val) => updateValue('maxBedrooms', val ? Number(val) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
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
            <Label className="text-base mb-3 block">Bathrooms</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minBathrooms" className="text-xs text-gray-600">
                  Min Bathrooms
                </Label>
                <Select
                  value={values.minBathrooms?.toString()}
                  onValueChange={(val) =>
                    updateValue('minBathrooms', val ? Number(val) : undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
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
                  Max Bathrooms
                </Label>
                <Select
                  value={values.maxBathrooms?.toString()}
                  onValueChange={(val) =>
                    updateValue('maxBathrooms', val ? Number(val) : undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
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
            <Label className="text-base mb-3 block">Square Footage</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minArea" className="text-xs text-gray-600">
                  Min Sq Ft
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
                  Max Sq Ft
                </Label>
                <Input
                  id="maxArea"
                  type="number"
                  placeholder="Any"
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
            <Label className="text-base mb-3 block">Price per Sq Ft</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPricePerSqFt" className="text-xs text-gray-600">
                  Min $/sq ft
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
                  Max $/sq ft
                </Label>
                <Input
                  id="maxPricePerSqFt"
                  type="number"
                  placeholder="Any"
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
            <Label className="text-base mb-3 block">Building Class</Label>
            <div className="flex flex-wrap gap-2">
              {BUILDING_CLASSES.map((cls) => (
                <div key={cls.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`class-${cls.value}`}
                    checked={(values.buildingClasses || []).includes(cls.value)}
                    onCheckedChange={() => toggleArrayValue('buildingClasses', cls.value)}
                  />
                  <label
                    htmlFor={`class-${cls.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {cls.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Renovation Type */}
          <div>
            <Label className="text-base mb-3 block">Renovation</Label>
            <div className="flex flex-wrap gap-2">
              {RENOVATION_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`reno-${type.value}`}
                    checked={(values.renovationTypes || []).includes(type.value)}
                    onCheckedChange={() => toggleArrayValue('renovationTypes', type.value)}
                  />
                  <label
                    htmlFor={`reno-${type.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Metro Distance */}
          <div>
            <Label className="text-base mb-3 block">Metro Distance</Label>
            <Select
              value={values.maxMetroDistance?.toString()}
              onValueChange={(val) => updateValue('maxMetroDistance', val && val !== '0' ? Number(val) : undefined)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any distance</SelectItem>
                {METRO_DISTANCES.map((dist) => (
                  <SelectItem key={dist.value} value={dist.value.toString()}>
                    Within {dist.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Built */}
          <div>
            <Label className="text-base mb-3 block">Year Built</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minYearBuilt" className="text-xs text-gray-600">
                  From
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
                  To
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
            <Label className="text-base mb-3 block">Floor</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minFloor" className="text-xs text-gray-600">
                  Min Floor
                </Label>
                <Select
                  value={values.minFloor?.toString()}
                  onValueChange={(val) => updateValue('minFloor', val && val !== '0' ? Number(val) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="2">Not first floor</SelectItem>
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
                  Max Floor
                </Label>
                <Select
                  value={values.maxFloor?.toString()}
                  onValueChange={(val) => updateValue('maxFloor', val && val !== '0' ? Number(val) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    {[3, 5, 10, 15, 20, 30, 50].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Up to {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Parking Type */}
          <div>
            <Label className="text-base mb-3 block">Parking</Label>
            <div className="flex flex-wrap gap-2">
              {PARKING_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`parking-${type.value}`}
                    checked={(values.parkingTypes || []).includes(type.value)}
                    onCheckedChange={() => toggleArrayValue('parkingTypes', type.value)}
                  />
                  <label
                    htmlFor={`parking-${type.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Building Features */}
          <div>
            <Label className="text-base mb-3 block">Building Features</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasBalcony"
                  checked={values.hasBalcony === true}
                  onCheckedChange={(checked) => updateValue('hasBalcony', checked ? true : undefined)}
                />
                <label htmlFor="hasBalcony" className="text-sm cursor-pointer">
                  Has Balcony
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasConcierge"
                  checked={values.hasConcierge === true}
                  onCheckedChange={(checked) => updateValue('hasConcierge', checked ? true : undefined)}
                />
                <label htmlFor="hasConcierge" className="text-sm cursor-pointer">
                  Concierge Service
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasGatedArea"
                  checked={values.hasGatedArea === true}
                  onCheckedChange={(checked) => updateValue('hasGatedArea', checked ? true : undefined)}
                />
                <label htmlFor="hasGatedArea" className="text-sm cursor-pointer">
                  Gated Community
                </label>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label className="text-base mb-3 block">Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AMENITIES.map((amenity) => (
                <div key={amenity.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity.value}`}
                    checked={values.amenities.includes(amenity.value)}
                    onCheckedChange={() => toggleArrayValue('amenities', amenity.value)}
                  />
                  <label
                    htmlFor={`amenity-${amenity.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label className="text-base mb-3 block">Location</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-xs text-gray-600">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="Enter city"
                  value={values.city || ''}
                  onChange={(e) => updateValue('city', e.target.value || undefined)}
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-xs text-gray-600">
                  State
                </Label>
                <Input
                  id="state"
                  placeholder="Enter state"
                  value={values.state || ''}
                  onChange={(e) => updateValue('state', e.target.value || undefined)}
                />
              </div>
            </div>
          </div>

          {/* Radius Search */}
          <div>
            <Label className="text-base mb-3 block">Search Radius</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-xs text-gray-600">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  placeholder="40.7128"
                  value={values.latitude || ''}
                  onChange={(e) =>
                    updateValue('latitude', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Label htmlFor="longitude" className="text-xs text-gray-600">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  placeholder="-74.0060"
                  value={values.longitude || ''}
                  onChange={(e) =>
                    updateValue('longitude', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Label htmlFor="radius" className="text-xs text-gray-600">
                  Radius (miles)
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
              Find properties within a specific radius of coordinates
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onApply} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={onReset}>
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
