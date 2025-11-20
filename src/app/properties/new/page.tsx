"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ImageUploader } from '@/components/properties/ImageUploader'
import { propertySchema, type PropertyFormData } from '@/lib/validations/property'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

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

export default function CreatePropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
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
        // Show success message
        alert(`Property "${property.title}" created successfully!`)
        // Redirect to properties list (property detail won't exist until we have database)
        router.push('/properties')
      } else {
        alert('Failed to create property. Please try again.')
      }
    } catch (error) {
      console.error('Error creating property:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step === currentStep
                        ? 'bg-blue-600 text-white'
                        : step < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? <Check className="h-5 w-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`h-1 w-16 md:w-32 mx-2 ${
                        step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs md:text-sm font-medium">Basics</span>
              <span className="text-xs md:text-sm font-medium">Details</span>
              <span className="text-xs md:text-sm font-medium">Photos</span>
              <span className="text-xs md:text-sm font-medium">Finish</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && 'Property Basics'}
                  {currentStep === 2 && 'Property Details'}
                  {currentStep === 3 && 'Property Photos'}
                  {currentStep === 4 && 'Description & Amenities'}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Tell us about your property'}
                  {currentStep === 2 && 'Add location and specifications'}
                  {currentStep === 3 && 'Upload photos of your property'}
                  {currentStep === 4 && 'Final details and features'}
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
                        placeholder="e.g., Modern 2-Bedroom Apartment in Downtown"
                      />
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
                            <SelectItem value="APARTMENT">Apartment</SelectItem>
                            <SelectItem value="HOUSE">House</SelectItem>
                            <SelectItem value="CONDO">Condo</SelectItem>
                            <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                            <SelectItem value="VILLA">Villa</SelectItem>
                            <SelectItem value="STUDIO">Studio</SelectItem>
                            <SelectItem value="LAND">Land</SelectItem>
                            <SelectItem value="COMMERCIAL">Commercial</SelectItem>
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
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SALE">For Sale</SelectItem>
                            <SelectItem value="RENT">For Rent</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.listingType && (
                          <p className="text-sm text-red-600 mt-1">{errors.listingType.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="price">Price ({listingType === 'RENT' ? '$ per month' : '$'}) *</Label>
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
                  </>
                )}

                {/* Step 2: Details */}
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
                        <Label htmlFor="state">State</Label>
                        <Input id="state" {...register('state')} placeholder="NY" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input id="zipCode" {...register('zipCode')} placeholder="10001" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
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
                        <Label htmlFor="area">Area (sq ft)</Label>
                        <Input
                          id="area"
                          type="number"
                          {...register('area', { valueAsNumber: true })}
                          placeholder="1200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="yearBuilt">Year Built</Label>
                        <Input
                          id="yearBuilt"
                          type="number"
                          {...register('yearBuilt', { valueAsNumber: true })}
                          placeholder="2018"
                        />
                      </div>

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
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="parking">Parking Spaces</Label>
                        <Input
                          id="parking"
                          type="number"
                          {...register('parking', { valueAsNumber: true })}
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Photos */}
                {currentStep === 3 && (
                  <div>
                    <Label>Property Photos</Label>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload high-quality photos of your property. The first image will be the primary image.
                    </p>
                    <ImageUploader
                      images={images}
                      onChange={(newImages) => setValue('images', newImages)}
                      maxImages={10}
                    />
                    {errors.images && (
                      <p className="text-sm text-red-600 mt-2">{errors.images.message}</p>
                    )}
                  </div>
                )}

                {/* Step 4: Description & Amenities */}
                {currentStep === 4 && (
                  <>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        {...register('description')}
                        rows={6}
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

                  {currentStep < 4 ? (
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
