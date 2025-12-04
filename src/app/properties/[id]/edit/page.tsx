"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  STATUS_TYPES,
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
  Loader2,
  MapPin,
  Home,
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
  { value: 'TERRACE', label: 'Terrace' },
  { value: 'ELEVATOR', label: 'Elevator' },
  { value: 'SECURITY', label: '24/7 Security' },
  { value: 'GYM', label: 'Gym' },
  { value: 'AIR_CONDITIONING', label: 'Air Conditioning' },
  { value: 'HEATING', label: 'Central Heating' },
  { value: 'FLOOR_HEATING', label: 'Floor Heating' },
  { value: 'PET_FRIENDLY', label: 'Pet Friendly' },
  { value: 'INTERNET', label: 'High-Speed Internet' },
  { value: 'DISHWASHER', label: 'Dishwasher' },
  { value: 'WASHING_MACHINE', label: 'Washing Machine' },
  { value: 'DRYER', label: 'Dryer' },
  { value: 'FIREPLACE', label: 'Fireplace' },
  { value: 'STORAGE', label: 'Storage Room' },
  { value: 'SAUNA', label: 'Sauna' },
  { value: 'JACUZZI', label: 'Jacuzzi' },
  { value: 'PLAYGROUND', label: 'Playground' },
  { value: 'DOORMAN', label: 'Doorman' },
] as const

const STEPS = [
  { number: 1, label: 'Basics', icon: Home },
  { number: 2, label: 'Location', icon: MapPin },
  { number: 3, label: 'Details', icon: Ruler },
  { number: 4, label: 'Condition', icon: Paintbrush },
  { number: 5, label: 'Photos', icon: Camera },
  { number: 6, label: 'Finish', icon: FileText },
]

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      country: 'USA',
      amenities: [],
      images: [],
    },
  })

  const selectedAmenities = watch('amenities') || []
  const propertyType = watch('propertyType')
  const listingType = watch('listingType')
  const images = watch('images') || []
  const buildingClass = watch('buildingClass')
  const buildingType = watch('buildingType')
  const parkingType = watch('parkingType')
  const renovation = watch('renovation')
  const windowView = watch('windowView')
  const bathroomType = watch('bathroomType')
  const furnished = watch('furnished')
  const area = watch('area')
  const price = watch('price')

  // Boolean fields
  const hasGarbageChute = watch('hasGarbageChute')
  const hasConcierge = watch('hasConcierge')
  const hasGatedArea = watch('hasGatedArea')

  const [propertyStatus, setPropertyStatus] = useState('ACTIVE')

  // Calculate price per square meter
  const pricePerSqM = area && price ? Math.round(price / area) : null

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`)
        if (!response.ok) throw new Error('Property not found')

        const property = await response.json()

        // Set status separately
        setPropertyStatus(property.status || 'ACTIVE')

        // Pre-populate form with all fields
        reset({
          title: property.title,
          description: property.description,
          propertyType: property.propertyType,
          listingType: property.listingType,
          price: property.price,
          // Location
          address: property.address,
          city: property.city?.nameEn || '',
          state: property.state || '',
          country: property.country || 'USA',
          zipCode: property.zipCode || '',
          district: property.district?.nameEn || '',
          nearestMetro: property.nearestMetro || '',
          metroDistance: property.metroDistance || undefined,
          latitude: property.latitude || undefined,
          longitude: property.longitude || undefined,
          // Areas
          area: property.area || undefined,
          livingArea: property.livingArea || undefined,
          kitchenArea: property.kitchenArea || undefined,
          rooms: property.rooms || undefined,
          bedrooms: property.bedrooms || undefined,
          bathrooms: property.bathrooms || undefined,
          // Building info
          yearBuilt: property.yearBuilt || undefined,
          floor: property.floor || undefined,
          totalFloors: property.totalFloors || undefined,
          ceilingHeight: property.ceilingHeight || undefined,
          buildingType: property.buildingType || undefined,
          buildingClass: property.buildingClass || undefined,
          buildingName: property.buildingName || '',
          // Features
          parking: property.parking || undefined,
          parkingType: property.parkingType || undefined,
          balcony: property.balcony || undefined,
          loggia: property.loggia || undefined,
          elevatorPassenger: property.elevatorPassenger || undefined,
          elevatorCargo: property.elevatorCargo || undefined,
          hasGarbageChute: property.hasGarbageChute || false,
          hasConcierge: property.hasConcierge || false,
          hasGatedArea: property.hasGatedArea || false,
          // Condition
          renovation: property.renovation || undefined,
          windowView: property.windowView || undefined,
          bathroomType: property.bathroomType || undefined,
          furnished: property.furnished || undefined,
          // Other
          images: property.images || [],
          amenities: property.amenities || [],
        })

        setIsLoading(false)
      } catch (err) {
        setError('Failed to load property. Please try again.')
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId, reset])

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
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status: propertyStatus }),
      })

      if (response.ok) {
        alert('Property updated successfully!')
        router.push('/dashboard?tab=properties')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to update property. Please try again.')
      }
    } catch (error) {
      console.error('Error updating property:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onError = (formErrors: any) => {
    console.log('Form validation errors:', formErrors)
    const errorMessages = Object.entries(formErrors)
      .map(([field, error]: [string, any]) => `${field}: ${error?.message}`)
      .join('\n')
    alert(`Please fix the following errors:\n${errorMessages}`)
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading property...</span>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {STEPS.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.number} className="flex items-center">
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
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`h-1 w-8 md:w-16 lg:w-24 mx-1 ${
                          step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-2">
              {STEPS.map((step) => (
                <span key={step.number} className="text-xs font-medium text-gray-600 flex-1 text-center">
                  {step.label}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = STEPS[currentStep - 1].icon
                    return <Icon className="h-5 w-5" />
                  })()}
                  Edit Property - {STEPS[currentStep - 1].label}
                </CardTitle>
                <CardDescription>
                  Update your property information
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Basics */}
                {currentStep === 1 && (
                  <>
                    <div>
                      <Label htmlFor="title">Property Title *</Label>
                      <Input id="title" {...register('title')} placeholder="e.g., Modern 2-bedroom apartment in city center" />
                      {errors.title && (
                        <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyType">Property Type *</Label>
                        <Select
                          value={propertyType}
                          onValueChange={(value) => setValue('propertyType', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROPERTY_TYPES.map((type) => (
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
                        <Label htmlFor="listingType">Listing Type *</Label>
                        <Select
                          value={listingType}
                          onValueChange={(value) => setValue('listingType', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select listing type" />
                          </SelectTrigger>
                          <SelectContent>
                            {LISTING_TYPES.map((type) => (
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
                        <Label htmlFor="price">Price ({listingType === 'RENT' ? '$ per month' : '$'}) *</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="e.g., 250000"
                          {...register('price', { valueAsNumber: true })}
                        />
                        {errors.price && (
                          <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                        )}
                        {pricePerSqM && (
                          <p className="text-sm text-gray-500 mt-1">
                            ${pricePerSqM.toLocaleString()} per sq ft
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={propertyStatus}
                          onValueChange={setPropertyStatus}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_TYPES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="buildingClass">Building Class</Label>
                        <Select
                          value={buildingClass || ''}
                          onValueChange={(value) => setValue('buildingClass', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {BUILDING_CLASSES.map((cls) => (
                              <SelectItem key={cls} value={cls}>
                                {LABELS.buildingClass[cls]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="buildingName">Building/Complex Name</Label>
                        <Input
                          id="buildingName"
                          {...register('buildingName')}
                          placeholder="e.g., Crystal Tower"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Location */}
                {currentStep === 2 && (
                  <>
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input id="address" {...register('address')} placeholder="e.g., 123 Main Street, Apt 4B" />
                      {errors.address && (
                        <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" {...register('city')} placeholder="e.g., New York" />
                        {errors.city && (
                          <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" {...register('state')} placeholder="e.g., NY" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="district">District/Neighborhood</Label>
                        <Input id="district" {...register('district')} placeholder="e.g., Manhattan" />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" {...register('zipCode')} placeholder="e.g., 10001" />
                      </div>
                    </div>

                    {/* Metro/Transit Info */}
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <Label className="font-medium mb-3 block">🚇 Transit Information</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nearestMetro">Nearest Metro/Station</Label>
                          <Input
                            id="nearestMetro"
                            {...register('nearestMetro')}
                            placeholder="e.g., Times Square"
                          />
                        </div>
                        <div>
                          <Label htmlFor="metroDistance">Walking Distance (min)</Label>
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
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <Label className="font-medium">GPS Coordinates (for map display)</Label>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        Enter coordinates to show your property on the map. You can find coordinates using Google Maps.
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
                          {errors.latitude && (
                            <p className="text-sm text-red-600 mt-1">{errors.latitude.message}</p>
                          )}
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
                          {errors.longitude && (
                            <p className="text-sm text-red-600 mt-1">{errors.longitude.message}</p>
                          )}
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
                      <Label className="font-medium mb-3 block">📐 Areas</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="area">Total Area (sq ft)</Label>
                          <Input
                            id="area"
                            type="number"
                            step="0.1"
                            {...register('area', { valueAsNumber: true })}
                            placeholder="e.g., 1200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="livingArea">Living Area</Label>
                          <Input
                            id="livingArea"
                            type="number"
                            step="0.1"
                            {...register('livingArea', { valueAsNumber: true })}
                            placeholder="e.g., 800"
                          />
                        </div>
                        <div>
                          <Label htmlFor="kitchenArea">Kitchen Area</Label>
                          <Input
                            id="kitchenArea"
                            type="number"
                            step="0.1"
                            {...register('kitchenArea', { valueAsNumber: true })}
                            placeholder="e.g., 150"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ceilingHeight">Ceiling Height (ft)</Label>
                          <Input
                            id="ceilingHeight"
                            type="number"
                            step="0.1"
                            {...register('ceilingHeight', { valueAsNumber: true })}
                            placeholder="e.g., 9.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rooms Section */}
                    <div className="border rounded-lg p-4">
                      <Label className="font-medium mb-3 block">🚪 Rooms</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="rooms">Total Rooms</Label>
                          <Input
                            id="rooms"
                            type="number"
                            {...register('rooms', { valueAsNumber: true })}
                            placeholder="e.g., 4"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Input
                            id="bedrooms"
                            type="number"
                            {...register('bedrooms', { valueAsNumber: true })}
                            placeholder="e.g., 2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            step="0.5"
                            {...register('bathrooms', { valueAsNumber: true })}
                            placeholder="e.g., 1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="balcony">Balconies</Label>
                          <Input
                            id="balcony"
                            type="number"
                            {...register('balcony', { valueAsNumber: true })}
                            placeholder="e.g., 1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <Label htmlFor="loggia">Loggias</Label>
                          <Input
                            id="loggia"
                            type="number"
                            {...register('loggia', { valueAsNumber: true })}
                            placeholder="e.g., 0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Building Info Section */}
                    <div className="border rounded-lg p-4">
                      <Label className="font-medium mb-3 block">🏢 Building Information</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="floor">Floor</Label>
                          <Input
                            id="floor"
                            type="number"
                            {...register('floor', { valueAsNumber: true })}
                            placeholder="e.g., 5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="totalFloors">Total Floors</Label>
                          <Input
                            id="totalFloors"
                            type="number"
                            {...register('totalFloors', { valueAsNumber: true })}
                            placeholder="e.g., 12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="yearBuilt">Year Built</Label>
                          <Input
                            id="yearBuilt"
                            type="number"
                            {...register('yearBuilt', { valueAsNumber: true })}
                            placeholder="e.g., 2020"
                          />
                        </div>
                        <div>
                          <Label htmlFor="buildingType">Building Type</Label>
                          <Select
                            value={buildingType || ''}
                            onValueChange={(value) => setValue('buildingType', value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {BUILDING_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {LABELS.buildingType[type]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <Label htmlFor="elevatorPassenger">Passenger Elevators</Label>
                          <Input
                            id="elevatorPassenger"
                            type="number"
                            {...register('elevatorPassenger', { valueAsNumber: true })}
                            placeholder="e.g., 2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="elevatorCargo">Cargo Elevators</Label>
                          <Input
                            id="elevatorCargo"
                            type="number"
                            {...register('elevatorCargo', { valueAsNumber: true })}
                            placeholder="e.g., 1"
                          />
                        </div>
                      </div>

                      {/* Building Features Checkboxes */}
                      <div className="mt-4 flex flex-wrap gap-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasGarbageChute"
                            checked={hasGarbageChute}
                            onCheckedChange={(checked) => setValue('hasGarbageChute', checked as boolean)}
                          />
                          <Label htmlFor="hasGarbageChute" className="cursor-pointer">Garbage Chute</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasConcierge"
                            checked={hasConcierge}
                            onCheckedChange={(checked) => setValue('hasConcierge', checked as boolean)}
                          />
                          <Label htmlFor="hasConcierge" className="cursor-pointer">Concierge</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasGatedArea"
                            checked={hasGatedArea}
                            onCheckedChange={(checked) => setValue('hasGatedArea', checked as boolean)}
                          />
                          <Label htmlFor="hasGatedArea" className="cursor-pointer">Gated Community</Label>
                        </div>
                      </div>
                    </div>

                    {/* Parking Section */}
                    <div className="border rounded-lg p-4">
                      <Label className="font-medium mb-3 block">🚗 Parking</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="parking">Parking Spaces</Label>
                          <Input
                            id="parking"
                            type="number"
                            {...register('parking', { valueAsNumber: true })}
                            placeholder="e.g., 1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="parkingType">Parking Type</Label>
                          <Select
                            value={parkingType || ''}
                            onValueChange={(value) => setValue('parkingType', value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PARKING_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {LABELS.parkingType[type]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        <Label htmlFor="renovation">Renovation Status</Label>
                        <Select
                          value={renovation || ''}
                          onValueChange={(value) => setValue('renovation', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {RENOVATION_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {LABELS.renovation[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="bathroomType">Bathroom Type</Label>
                        <Select
                          value={bathroomType || ''}
                          onValueChange={(value) => setValue('bathroomType', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {BATHROOM_TYPES.map((type) => (
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
                        <Label htmlFor="windowView">Window View</Label>
                        <Select
                          value={windowView || ''}
                          onValueChange={(value) => setValue('windowView', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select view" />
                          </SelectTrigger>
                          <SelectContent>
                            {WINDOW_VIEWS.map((type) => (
                              <SelectItem key={type} value={type}>
                                {LABELS.windowView[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="furnished">Furnished Status</Label>
                        <Select
                          value={furnished || ''}
                          onValueChange={(value) => setValue('furnished', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {FURNISHED_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {LABELS.furnished[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        💡 <strong>Tip:</strong> Properties with detailed condition information tend to get
                        more views and faster responses from potential buyers/renters.
                      </p>
                    </div>
                  </>
                )}

                {/* Step 5: Photos */}
                {currentStep === 5 && (
                  <div>
                    <Label>Property Photos *</Label>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload high-quality photos of your property. The first image will be the primary image.
                      Properties with more photos receive more inquiries.
                    </p>
                    <ImageUploader
                      images={images}
                      onChange={(newImages) => setValue('images', newImages)}
                      maxImages={20}
                    />
                    {errors.images && (
                      <p className="text-sm text-red-600 mt-2">{errors.images.message}</p>
                    )}
                    <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        📸 <strong>Photo Tips:</strong> Include photos of all rooms, kitchen, bathrooms,
                        views from windows, building entrance, and neighborhood. Properties with 10+ photos
                        get 3x more views!
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 6: Description & Amenities */}
                {currentStep === 6 && (
                  <>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <p className="text-sm text-gray-500 mb-2">
                        Minimum 50 characters. Describe what makes your property special.
                      </p>
                      <Textarea
                        id="description"
                        {...register('description')}
                        rows={6}
                        placeholder="Describe your property in detail. Include information about the layout, recent renovations, neighborhood amenities, transportation options, and what makes this property special..."
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Amenities & Features</Label>
                      <p className="text-sm text-gray-500 mb-3">
                        Select all amenities available in the property
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Update Property
                        </>
                      )}
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
