"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUploader } from '@/components/properties/ImageUploader'
import {
  propertySchema,
  type PropertyFormData,
  PROPERTY_TYPES,
  LISTING_TYPES,
  BUILDING_TYPES,
  BUILDING_CLASSES,
  PARKING_TYPES,
  RENOVATION_TYPES,
  WINDOW_VIEWS,
  BATHROOM_TYPES,
  FURNISHED_TYPES,
  LABELS
} from '@/lib/validations/property'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Home,
  MapPin,
  Ruler,
  Paintbrush,
  Camera,
  FileText
} from 'lucide-react'

const AMENITIES = [
  { value: 'PARKING', label: 'Parking' },
  { value: 'GARAGE', label: 'Garage' },
  { value: 'POOL', label: 'Pool' },
  { value: 'GARDEN', label: 'Garden' },
  { value: 'BALCONY', label: 'Balcony' },
  { value: 'ELEVATOR', label: 'Elevator' },
  { value: 'SECURITY', label: 'Security' },
  { value: 'GYM', label: 'Gym' },
  { value: 'AIR_CONDITIONING', label: 'Air Conditioning' },
  { value: 'HEATING', label: 'Heating' },
  { value: 'FURNISHED', label: 'Furnished' },
  { value: 'PET_FRIENDLY', label: 'Pet Friendly' },
  { value: 'INTERNET', label: 'High-Speed Internet' },
  { value: 'DISHWASHER', label: 'Dishwasher' },
  { value: 'WASHING_MACHINE', label: 'Washing Machine' },
  { value: 'FIREPLACE', label: 'Fireplace' },
  { value: 'STORAGE', label: 'Storage' },
] as const

const STEPS = [
  { number: 1, title: 'Basics', icon: Home },
  { number: 2, title: 'Location', icon: MapPin },
  { number: 3, title: 'Details', icon: Ruler },
  { number: 4, title: 'Condition', icon: Paintbrush },
  { number: 5, title: 'Photos', icon: Camera },
  { number: 6, title: 'Description', icon: FileText },
]

export default function CreatePropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      country: 'USA',
      amenities: [],
      images: [],
      hasGarbageChute: false,
      hasConcierge: false,
      hasGatedArea: false,
    },
  })

  const selectedAmenities = watch('amenities') || []
  const propertyType = watch('propertyType')
  const listingType = watch('listingType')
  const buildingClass = watch('buildingClass')
  const buildingType = watch('buildingType')
  const parkingType = watch('parkingType')
  const renovation = watch('renovation')
  const windowView = watch('windowView')
  const bathroomType = watch('bathroomType')
  const furnished = watch('furnished')
  const images = watch('images') || []
  const area = watch('area')
  const price = watch('price')

  const toggleAmenity = (amenity: string) => {
    const current = selectedAmenities
    if (current.includes(amenity as any)) {
      setValue('amenities', current.filter(a => a !== amenity) as any)
    } else {
      setValue('amenities', [...current, amenity] as any)
    }
  }

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const property = await response.json()
        toast.success(`Property "${property.title}" created successfully!`)
        router.push('/properties')
      } else {
        toast.error('Failed to create property. Please try again.')
      }
    } catch (error) {
      console.error('Error creating property:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onError = (formErrors: any) => {
    console.log('Form validation errors:', formErrors)
    const errorMessages = Object.entries(formErrors)
      .map(([field, error]: [string, any]) => `${field}: ${error?.message}`)
      .join('\n')
    toast.error(`Please fix validation errors:\n${errorMessages}`)
  }

  // Define which fields to validate per step
  const stepFields: Record<number, (keyof PropertyFormData)[]> = {
    1: ['title', 'propertyType', 'listingType', 'price'],
    2: ['address', 'city'],
    3: [],
    4: [],
    5: ['images'],
    6: ['description'],
  }

  const nextStep = async () => {
    const fieldsToValidate = stepFields[currentStep]
    const isValid = fieldsToValidate.length === 0 || await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 6))
    }
  }

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  // Calculate price per m²
  const pricePerSqM = area && price ? Math.round(price / area) : null

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, idx) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex flex-col items-center ${idx < STEPS.length - 1 ? 'flex-1' : ''}`}
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                        step.number === currentStep
                          ? 'bg-blue-600 text-white'
                          : step.number < currentStep
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.number < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-1 w-8 sm:w-16 mx-1 ${
                        step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {STEPS[currentStep - 1].icon && (
                    <STEPS[currentStep - 1].icon className="h-5 w-5" />
                  )}
                  Step {currentStep}: {STEPS[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Basic property information'}
                  {currentStep === 2 && 'Property location and address'}
                  {currentStep === 3 && 'Property specifications and building details'}
                  {currentStep === 4 && 'Apartment condition and features'}
                  {currentStep === 5 && 'Upload property photos'}
                  {currentStep === 6 && 'Description and amenities'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Basics */}
                {currentStep === 1 && (
                  <>
                    <div>
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        {...register('title')}
                        placeholder="e.g., Modern 3-Room Apartment in City Center"
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Property Type *</Label>
                        <Select
                          value={propertyType}
                          onValueChange={(value) => setValue('propertyType', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROPERTY_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {LABELS.propertyType[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.propertyType && (
                          <p className="text-sm text-red-600 mt-1">{errors.propertyType.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>Listing Type *</Label>
                        <Select
                          value={listingType}
                          onValueChange={(value) => setValue('listingType', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {LISTING_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {LABELS.listingType[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.listingType && (
                          <p className="text-sm text-red-600 mt-1">{errors.listingType.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">
                          Price ({listingType === 'RENT' ? '$ per month' : '$'}) *
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          {...register('price', { valueAsNumber: true })}
                          placeholder="e.g., 250000"
                        />
                        {errors.price && (
                          <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>Building Class</Label>
                        <Select
                          value={buildingClass}
                          onValueChange={(value) => setValue('buildingClass', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {BUILDING_CLASSES.map(cls => (
                              <SelectItem key={cls} value={cls}>
                                {LABELS.buildingClass[cls]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="buildingName">Building/Complex Name</Label>
                      <Input
                        id="buildingName"
                        {...register('buildingName')}
                        placeholder="e.g., Riverside Tower, Park View Residences"
                      />
                    </div>
                  </>
                )}

                {/* Step 2: Location */}
                {currentStep === 2 && (
                  <>
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        {...register('address')}
                        placeholder="123 Main Street, Apt 4B"
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" {...register('city')} placeholder="New York" />
                        {errors.city && (
                          <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">State/Region</Label>
                        <Input id="state" {...register('state')} placeholder="NY" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">Zip/Postal Code</Label>
                        <Input id="zipCode" {...register('zipCode')} placeholder="10001" />
                      </div>
                      <div>
                        <Label htmlFor="district">District/Neighborhood</Label>
                        <Input id="district" {...register('district')} placeholder="Manhattan" />
                      </div>
                    </div>

                    {/* Metro/Transit */}
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <Label className="font-medium text-blue-900">Public Transit</Label>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <Label htmlFor="nearestMetro">Nearest Metro/Station</Label>
                          <Input
                            id="nearestMetro"
                            {...register('nearestMetro')}
                            placeholder="e.g., Times Square"
                          />
                        </div>
                        <div>
                          <Label htmlFor="metroDistance">Walking Distance (minutes)</Label>
                          <Input
                            id="metroDistance"
                            type="number"
                            {...register('metroDistance', { valueAsNumber: true })}
                            placeholder="e.g., 5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* GPS Coordinates */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <Label className="font-medium">GPS Coordinates (for map)</Label>
                      <p className="text-sm text-gray-500 mb-3">
                        Find coordinates on Google Maps by right-clicking on location
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="any"
                            placeholder="e.g., 40.7128"
                            {...register('latitude', { valueAsNumber: true })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="any"
                            placeholder="e.g., -74.0060"
                            {...register('longitude', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Property Details */}
                {currentStep === 3 && (
                  <>
                    {/* Areas Section */}
                    <div className="border rounded-lg p-4">
                      <Label className="font-medium text-lg mb-4 block">Area Details</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="area">Total Area (m²)</Label>
                          <Input
                            id="area"
                            type="number"
                            {...register('area', { valueAsNumber: true })}
                            placeholder="108"
                          />
                        </div>
                        <div>
                          <Label htmlFor="livingArea">Living Area (m²)</Label>
                          <Input
                            id="livingArea"
                            type="number"
                            {...register('livingArea', { valueAsNumber: true })}
                            placeholder="75"
                          />
                        </div>
                        <div>
                          <Label htmlFor="kitchenArea">Kitchen Area (m²)</Label>
                          <Input
                            id="kitchenArea"
                            type="number"
                            {...register('kitchenArea', { valueAsNumber: true })}
                            placeholder="15"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ceilingHeight">Ceiling Height (m)</Label>
                          <Input
                            id="ceilingHeight"
                            type="number"
                            step="0.1"
                            {...register('ceilingHeight', { valueAsNumber: true })}
                            placeholder="2.7"
                          />
                        </div>
                      </div>

                      {/* Price per m² display */}
                      {pricePerSqM && (
                        <div className="mt-3 p-2 bg-green-50 rounded text-green-700 text-sm">
                          Price per m²: <strong>${pricePerSqM.toLocaleString()}</strong>
                        </div>
                      )}
                    </div>

                    {/* Rooms Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="rooms">Total Rooms</Label>
                        <Input
                          id="rooms"
                          type="number"
                          {...register('rooms', { valueAsNumber: true })}
                          placeholder="3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          {...register('bedrooms', { valueAsNumber: true })}
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          step="0.5"
                          {...register('bathrooms', { valueAsNumber: true })}
                          placeholder="1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="balcony">Balconies</Label>
                        <Input
                          id="balcony"
                          type="number"
                          {...register('balcony', { valueAsNumber: true })}
                          placeholder="1"
                        />
                      </div>
                    </div>

                    {/* Building Section */}
                    <div className="border rounded-lg p-4">
                      <Label className="font-medium text-lg mb-4 block">Building Info</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="floor">Floor</Label>
                          <Input
                            id="floor"
                            type="number"
                            {...register('floor', { valueAsNumber: true })}
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="totalFloors">Total Floors</Label>
                          <Input
                            id="totalFloors"
                            type="number"
                            {...register('totalFloors', { valueAsNumber: true })}
                            placeholder="22"
                          />
                        </div>
                        <div>
                          <Label htmlFor="yearBuilt">Year Built</Label>
                          <Input
                            id="yearBuilt"
                            type="number"
                            {...register('yearBuilt', { valueAsNumber: true })}
                            placeholder="2020"
                          />
                        </div>
                        <div>
                          <Label>Building Type</Label>
                          <Select
                            value={buildingType}
                            onValueChange={(value) => setValue('buildingType', value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {BUILDING_TYPES.map(type => (
                                <SelectItem key={type} value={type}>
                                  {LABELS.buildingType[type]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Elevators and Facilities */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <Label htmlFor="elevatorPassenger">Passenger Elevators</Label>
                          <Input
                            id="elevatorPassenger"
                            type="number"
                            {...register('elevatorPassenger', { valueAsNumber: true })}
                            placeholder="2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="elevatorCargo">Cargo Elevators</Label>
                          <Input
                            id="elevatorCargo"
                            type="number"
                            {...register('elevatorCargo', { valueAsNumber: true })}
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="parking">Parking Spaces</Label>
                          <Input
                            id="parking"
                            type="number"
                            {...register('parking', { valueAsNumber: true })}
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <Label>Parking Type</Label>
                          <Select
                            value={parkingType}
                            onValueChange={(value) => setValue('parkingType', value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {PARKING_TYPES.map(type => (
                                <SelectItem key={type} value={type}>
                                  {LABELS.parkingType[type]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Building features checkboxes */}
                      <div className="flex flex-wrap gap-6 mt-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasGarbageChute"
                            checked={watch('hasGarbageChute')}
                            onCheckedChange={(checked) => setValue('hasGarbageChute', !!checked)}
                          />
                          <Label htmlFor="hasGarbageChute" className="cursor-pointer">
                            Garbage Chute
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasConcierge"
                            checked={watch('hasConcierge')}
                            onCheckedChange={(checked) => setValue('hasConcierge', !!checked)}
                          />
                          <Label htmlFor="hasConcierge" className="cursor-pointer">
                            Concierge
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasGatedArea"
                            checked={watch('hasGatedArea')}
                            onCheckedChange={(checked) => setValue('hasGatedArea', !!checked)}
                          />
                          <Label htmlFor="hasGatedArea" className="cursor-pointer">
                            Gated Community
                          </Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 4: Condition */}
                {currentStep === 4 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Renovation/Condition</Label>
                        <Select
                          value={renovation}
                          onValueChange={(value) => setValue('renovation', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {RENOVATION_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {LABELS.renovation[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Bathroom Type</Label>
                        <Select
                          value={bathroomType}
                          onValueChange={(value) => setValue('bathroomType', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {BATHROOM_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {LABELS.bathroomType[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Window View</Label>
                        <Select
                          value={windowView}
                          onValueChange={(value) => setValue('windowView', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select view" />
                          </SelectTrigger>
                          <SelectContent>
                            {WINDOW_VIEWS.map(type => (
                              <SelectItem key={type} value={type}>
                                {LABELS.windowView[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Furnished</Label>
                        <Select
                          value={furnished}
                          onValueChange={(value) => setValue('furnished', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            {FURNISHED_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {LABELS.furnished[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 5: Photos */}
                {currentStep === 5 && (
                  <div>
                    <Label>Property Photos *</Label>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload high-quality photos. The first image will be the main photo.
                    </p>
                    <ImageUploader
                      images={images}
                      onChange={(newImages) => setValue('images', newImages)}
                      maxImages={15}
                    />
                    {errors.images && (
                      <p className="text-sm text-red-600 mt-2">{errors.images.message}</p>
                    )}
                  </div>
                )}

                {/* Step 6: Description & Amenities */}
                {currentStep === 6 && (
                  <>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        {...register('description')}
                        rows={8}
                        placeholder="Describe your property in detail. Include information about the neighborhood, nearby amenities, and what makes this property special..."
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Amenities & Features</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {AMENITIES.map((amenity) => (
                          <div
                            key={amenity.value}
                            onClick={() => toggleAmenity(amenity.value)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                              selectedAmenities.includes(amenity.value as any)
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{amenity.label}</span>
                              {selectedAmenities.includes(amenity.value as any) && (
                                <Check className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Selected: {selectedAmenities.length} amenities
                      </p>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < 6 ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Property'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}
