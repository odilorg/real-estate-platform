"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
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
  regions,
  getCitiesByRegion,
  getDistrictsByCity,
  getMetrosByCity,
  cityHasMetro,
  getLocalizedName,
  type Region,
  type City,
  type District,
  type MetroStation,
} from '@/lib/locations'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Home,
  MapPin,
  Ruler,
  Paintbrush,
  Camera,
  FileText,
  Train
} from 'lucide-react'
import { useLocale } from 'next-intl'

const AMENITY_KEYS = [
  'PARKING',
  'GARAGE',
  'POOL',
  'GARDEN',
  'BALCONY',
  'ELEVATOR',
  'SECURITY',
  'GYM',
  'AIR_CONDITIONING',
  'HEATING',
  'FURNISHED',
  'PET_FRIENDLY',
  'INTERNET',
  'DISHWASHER',
  'WASHING_MACHINE',
  'FIREPLACE',
  'STORAGE',
] as const

const STEP_ICONS = [Home, MapPin, Ruler, Paintbrush, Camera, FileText]

export default function CreatePropertyPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('properties.form')
  const tTypes = useTranslations('properties.types')
  const tListingTypes = useTranslations('properties.listingTypes')
  const tBuildingClasses = useTranslations('properties.buildingClasses')
  const tRenovation = useTranslations('properties.renovationTypes')
  const tParking = useTranslations('properties.parkingTypes')
  const tAmenities = useTranslations('amenities')
  const tCommon = useTranslations('common')
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Location select states
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedCityId, setSelectedCityId] = useState<string>('')
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('')
  const [availableCities, setAvailableCities] = useState<City[]>([])
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([])
  const [availableMetros, setAvailableMetros] = useState<MetroStation[]>([])
  const [showMetroField, setShowMetroField] = useState(false)

  // Translated step titles
  const STEPS = [
    { number: 1, title: t('steps.basics'), desc: t('steps.basicsDesc'), icon: Home },
    { number: 2, title: t('steps.location'), desc: t('steps.locationDesc'), icon: MapPin },
    { number: 3, title: t('steps.details'), desc: t('steps.detailsDesc'), icon: Ruler },
    { number: 4, title: t('steps.condition'), desc: t('steps.conditionDesc'), icon: Paintbrush },
    { number: 5, title: t('steps.photos'), desc: t('steps.photosDesc'), icon: Camera },
    { number: 6, title: t('steps.description'), desc: t('steps.descriptionDesc'), icon: FileText },
  ]

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
      country: 'Узбекистан',
      amenities: [],
      images: [],
      hasGarbageChute: false,
      hasConcierge: false,
      hasGatedArea: false,
    },
  })

  // Location change handlers
  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId)
    setSelectedCityId('')
    setSelectedDistrictId('')
    setAvailableDistricts([])
    setAvailableMetros([])
    setShowMetroField(false)

    const cities = getCitiesByRegion(regionId)
    setAvailableCities(cities)

    // Clear form values
    setValue('city', '')
    setValue('state', getLocalizedName(regions.find(r => r.id === regionId)!, locale))
    setValue('district', '')
    setValue('nearestMetro', '')
  }

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId)
    setSelectedDistrictId('')
    setAvailableMetros([])

    const districts = getDistrictsByCity(selectedRegion, cityId)
    setAvailableDistricts(districts)

    const city = availableCities.find(c => c.id === cityId)
    if (city) {
      setValue('city', getLocalizedName(city, locale))
    }

    const hasMetro = cityHasMetro(selectedRegion, cityId)
    setShowMetroField(hasMetro)

    if (hasMetro) {
      const metros = getMetrosByCity(selectedRegion, cityId)
      setAvailableMetros(metros)
    }

    setValue('district', '')
    setValue('nearestMetro', '')
  }

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId)

    const district = availableDistricts.find(d => d.id === districtId)
    if (district) {
      setValue('district', getLocalizedName(district, locale))
    }
  }

  const handleMetroChange = (metroId: string) => {
    const metro = availableMetros.find(m => m.id === metroId)
    if (metro) {
      setValue('nearestMetro', getLocalizedName(metro, locale))
    }
  }

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

  // Field name translations for error messages
  const fieldLabels: Record<string, string> = {
    title: t('title'),
    description: t('description'),
    propertyType: t('propertyType'),
    listingType: t('listingType'),
    price: t('price'),
    address: t('address'),
    city: t('city'),
    state: t('state'),
    zipCode: t('zipCode'),
    district: t('district'),
    latitude: t('latitude'),
    longitude: t('longitude'),
    nearestMetro: t('nearestMetro'),
    metroDistance: t('metroDistance'),
    area: t('area'),
    livingArea: t('livingArea'),
    kitchenArea: t('kitchenArea'),
    rooms: t('rooms'),
    bedrooms: t('bedrooms'),
    bathrooms: t('bathrooms'),
    floor: t('floor'),
    totalFloors: t('totalFloors'),
    yearBuilt: t('yearBuilt'),
    ceilingHeight: t('ceilingHeight'),
    balcony: t('balconies'),
    loggia: t('loggia') || 'Loggia',
    parking: t('parkingSpaces'),
    elevatorPassenger: t('elevatorPassenger'),
    elevatorCargo: t('elevatorCargo'),
    images: t('images'),
  }

  const onError = (formErrors: any) => {
    console.log('Form validation errors:', formErrors)
    const errorList = Object.entries(formErrors)
      .map(([field, error]: [string, any]) => {
        const label = fieldLabels[field] || field
        return `• ${label}: ${error?.message}`
      })

    // Show a more user-friendly toast with the first few errors
    const displayErrors = errorList.slice(0, 5)
    const remaining = errorList.length - 5

    toast.error(
      <div className="space-y-1">
        <p className="font-medium">{tCommon('fixErrors') || 'Please fix the following errors:'}</p>
        {displayErrors.map((err, i) => (
          <p key={i} className="text-sm">{err}</p>
        ))}
        {remaining > 0 && (
          <p className="text-sm text-gray-400">...and {remaining} more</p>
        )}
      </div>
    )
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
                  {(() => {
                    const Icon = STEPS[currentStep - 1].icon
                    return Icon ? <Icon className="h-5 w-5" /> : null
                  })()}
                  {STEPS[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {STEPS[currentStep - 1].desc}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Basics */}
                {currentStep === 1 && (
                  <>
                    <div>
                      <Label htmlFor="title">{t('title')} *</Label>
                      <Input
                        id="title"
                        {...register('title')}
                        placeholder={t('titlePlaceholder')}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t('propertyType')} *</Label>
                        <Select
                          value={propertyType}
                          onValueChange={(value) => setValue('propertyType', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={tCommon('any')} />
                          </SelectTrigger>
                          <SelectContent>
                            {PROPERTY_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {tTypes(type.toLowerCase() as any)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.propertyType && (
                          <p className="text-sm text-red-600 mt-1">{errors.propertyType.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>{t('listingType')} *</Label>
                        <Select
                          value={listingType}
                          onValueChange={(value) => setValue('listingType', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={tCommon('any')} />
                          </SelectTrigger>
                          <SelectContent>
                            {LISTING_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {tListingTypes(type.toLowerCase() as any)}
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
                          {t('price')} ({listingType === 'RENT' ? t('pricePerMonth') : '$'}) *
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          {...register('price', { valueAsNumber: true })}
                          placeholder="250000"
                        />
                        {errors.price && (
                          <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>{t('buildingClass')}</Label>
                        <Select
                          value={buildingClass}
                          onValueChange={(value) => setValue('buildingClass', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={tCommon('any')} />
                          </SelectTrigger>
                          <SelectContent>
                            {BUILDING_CLASSES.map(cls => (
                              <SelectItem key={cls} value={cls}>
                                {tBuildingClasses(cls.toLowerCase() as any)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="buildingName">{t('buildingName')}</Label>
                      <Input
                        id="buildingName"
                        {...register('buildingName')}
                        placeholder={t('buildingNamePlaceholder')}
                      />
                    </div>
                  </>
                )}

                {/* Step 2: Location */}
                {currentStep === 2 && (
                  <>
                    {/* Region & City Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t('state')} *</Label>
                        <Select
                          value={selectedRegion}
                          onValueChange={handleRegionChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectRegion')} />
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
                        <Label>{t('city')} *</Label>
                        <Select
                          value={selectedCityId}
                          onValueChange={handleCityChange}
                          disabled={!selectedRegion}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={selectedRegion ? t('selectCity') : t('selectRegionFirst')} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCities.map(city => (
                              <SelectItem key={city.id} value={city.id}>
                                {getLocalizedName(city, locale)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.city && (
                          <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                        )}
                      </div>
                    </div>

                    {/* District Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t('district')}</Label>
                        <Select
                          value={selectedDistrictId}
                          onValueChange={handleDistrictChange}
                          disabled={!selectedCityId || availableDistricts.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={selectedCityId ? t('selectDistrict') : t('selectCityFirst')} />
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
                      <div>
                        <Label htmlFor="zipCode">{t('zipCode')}</Label>
                        <Input id="zipCode" {...register('zipCode')} placeholder="100000" />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <Label htmlFor="address">{t('address')} *</Label>
                      <Input
                        id="address"
                        {...register('address')}
                        placeholder={t('addressPlaceholder')}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    {/* Metro/Transit - Only show for cities with metro */}
                    {showMetroField && (
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <div className="flex items-center gap-2 mb-3">
                          <Train className="h-5 w-5 text-blue-600" />
                          <Label className="font-medium text-blue-900">{t('publicTransit')}</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>{t('nearestMetro')}</Label>
                            <Select
                              onValueChange={handleMetroChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t('selectMetro')} />
                              </SelectTrigger>
                              <SelectContent>
                                {availableMetros.map(metro => (
                                  <SelectItem key={metro.id} value={metro.id}>
                                    {getLocalizedName(metro, locale)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="metroDistance">{t('metroDistance')}</Label>
                            <Input
                              id="metroDistance"
                              type="number"
                              {...register('metroDistance', { valueAsNumber: true })}
                              placeholder="5"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GPS Coordinates */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <Label className="font-medium">{t('gpsCoordinates')}</Label>
                      <p className="text-sm text-gray-500 mb-3">
                        {t('gpsHelp')}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="latitude">{t('latitude')}</Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="any"
                            placeholder="40.7128"
                            {...register('latitude', { valueAsNumber: true })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="longitude">{t('longitude')}</Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="any"
                            placeholder="-74.0060"
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
                      <Label className="font-medium text-lg mb-4 block">{t('areaDetails')}</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="area">{t('area')}</Label>
                          <Input
                            id="area"
                            type="number"
                            {...register('area', { valueAsNumber: true })}
                            placeholder="108"
                          />
                        </div>
                        <div>
                          <Label htmlFor="livingArea">{t('livingArea')}</Label>
                          <Input
                            id="livingArea"
                            type="number"
                            {...register('livingArea', { valueAsNumber: true })}
                            placeholder="75"
                          />
                        </div>
                        <div>
                          <Label htmlFor="kitchenArea">{t('kitchenArea')}</Label>
                          <Input
                            id="kitchenArea"
                            type="number"
                            {...register('kitchenArea', { valueAsNumber: true })}
                            placeholder="15"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ceilingHeight">{t('ceilingHeight')}</Label>
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
                          {t('pricePerSqm')}: <strong>${pricePerSqM.toLocaleString()}</strong>
                        </div>
                      )}
                    </div>

                    {/* Rooms Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="rooms">{t('rooms')}</Label>
                        <Input
                          id="rooms"
                          type="number"
                          {...register('rooms', { valueAsNumber: true })}
                          placeholder="3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bedrooms">{t('bedrooms')}</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          {...register('bedrooms', { valueAsNumber: true })}
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">{t('bathrooms')}</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          step="0.5"
                          {...register('bathrooms', { valueAsNumber: true })}
                          placeholder="1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="balcony">{t('balconies')}</Label>
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
                      <Label className="font-medium text-lg mb-4 block">{t('buildingInfo')}</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="floor">{t('floor')}</Label>
                          <Input
                            id="floor"
                            type="number"
                            {...register('floor', { valueAsNumber: true })}
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="totalFloors">{t('totalFloors')}</Label>
                          <Input
                            id="totalFloors"
                            type="number"
                            {...register('totalFloors', { valueAsNumber: true })}
                            placeholder="22"
                          />
                        </div>
                        <div>
                          <Label htmlFor="yearBuilt">{t('yearBuilt')}</Label>
                          <Input
                            id="yearBuilt"
                            type="number"
                            {...register('yearBuilt', { valueAsNumber: true })}
                            placeholder="2020"
                          />
                        </div>
                        <div>
                          <Label>{t('buildingType')}</Label>
                          <Select
                            value={buildingType}
                            onValueChange={(value) => setValue('buildingType', value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={tCommon('any')} />
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
                          <Label htmlFor="elevatorPassenger">{t('elevatorPassenger')}</Label>
                          <Input
                            id="elevatorPassenger"
                            type="number"
                            {...register('elevatorPassenger', { valueAsNumber: true })}
                            placeholder="2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="elevatorCargo">{t('elevatorCargo')}</Label>
                          <Input
                            id="elevatorCargo"
                            type="number"
                            {...register('elevatorCargo', { valueAsNumber: true })}
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="parking">{t('parkingSpaces')}</Label>
                          <Input
                            id="parking"
                            type="number"
                            {...register('parking', { valueAsNumber: true })}
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <Label>{t('parkingType')}</Label>
                          <Select
                            value={parkingType}
                            onValueChange={(value) => setValue('parkingType', value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={tCommon('any')} />
                            </SelectTrigger>
                            <SelectContent>
                              {PARKING_TYPES.map(type => (
                                <SelectItem key={type} value={type}>
                                  {tParking(type.toLowerCase() as any)}
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
                            {t('garbageChute')}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasConcierge"
                            checked={watch('hasConcierge')}
                            onCheckedChange={(checked) => setValue('hasConcierge', !!checked)}
                          />
                          <Label htmlFor="hasConcierge" className="cursor-pointer">
                            {t('concierge')}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasGatedArea"
                            checked={watch('hasGatedArea')}
                            onCheckedChange={(checked) => setValue('hasGatedArea', !!checked)}
                          />
                          <Label htmlFor="hasGatedArea" className="cursor-pointer">
                            {t('gatedCommunity')}
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
                        <Label>{t('renovation')}</Label>
                        <Select
                          value={renovation}
                          onValueChange={(value) => setValue('renovation', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={tCommon('any')} />
                          </SelectTrigger>
                          <SelectContent>
                            {RENOVATION_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {tRenovation(type.toLowerCase() as any)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>{t('bathroomType')}</Label>
                        <Select
                          value={bathroomType}
                          onValueChange={(value) => setValue('bathroomType', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={tCommon('any')} />
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
                        <Label>{t('windowView')}</Label>
                        <Select
                          value={windowView}
                          onValueChange={(value) => setValue('windowView', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={tCommon('any')} />
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
                        <Label>{t('furnished')}</Label>
                        <Select
                          value={furnished}
                          onValueChange={(value) => setValue('furnished', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={tCommon('any')} />
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
                    <Label>{t('images')} *</Label>
                    <p className="text-sm text-gray-600 mb-4">
                      {t('uploadImages')}
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
                      <Label htmlFor="description">{t('description')} *</Label>
                      <Textarea
                        id="description"
                        {...register('description')}
                        rows={8}
                        placeholder={t('descriptionPlaceholder')}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>{t('amenities')}</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {AMENITY_KEYS.map((amenityKey) => (
                          <div
                            key={amenityKey}
                            onClick={() => toggleAmenity(amenityKey)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                              selectedAmenities.includes(amenityKey as any)
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{tAmenities(amenityKey.toLowerCase().replace('_', '') as any)}</span>
                              {selectedAmenities.includes(amenityKey as any) && (
                                <Check className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {tCommon('showing')}: {selectedAmenities.length}
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
                    {tCommon('previous')}
                  </Button>

                  {currentStep < 6 ? (
                    <Button type="button" onClick={nextStep}>
                      {tCommon('next')}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? tCommon('loading') : t('submit')}
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
