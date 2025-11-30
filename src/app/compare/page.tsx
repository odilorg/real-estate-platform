"use client"

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { MainLayout } from '@/components/layout'
import { useComparison } from '@/contexts/ComparisonContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  X,
  ArrowLeft,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Building2,
  Layers,
  Car,
  Home,
  Check,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react'

export default function ComparePage() {
  const t = useTranslations('compare')
  const tProp = useTranslations('properties')
  const { properties, removeFromComparison, clearComparison } = useComparison()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatArea = (area?: number) => {
    if (!area) return '-'
    return `${new Intl.NumberFormat('en-US').format(area)} m²`
  }

  // Comparison attributes
  const attributes = [
    { key: 'price', label: t('price'), render: (p: any) => (
      <span className="font-semibold text-blue-600">
        {formatPrice(p.price)}
        {p.listingType === 'RENT' && <span className="text-sm text-gray-500">/mo</span>}
      </span>
    )},
    { key: 'propertyType', label: tProp('details.propertyType'), render: (p: any) => p.propertyType },
    { key: 'listingType', label: tProp('details.listingType'), render: (p: any) => (
      <Badge variant={p.listingType === 'SALE' ? 'default' : 'secondary'}>
        {p.listingType === 'SALE' ? tProp('listingTypes.sale') : tProp('listingTypes.rent')}
      </Badge>
    )},
    { key: 'location', label: t('location'), render: (p: any) => `${p.city}${p.state ? `, ${p.state}` : ''}` },
    { key: 'bedrooms', label: t('bedrooms'), render: (p: any) => (
      <span className="flex items-center gap-1">
        <Bed className="h-4 w-4" /> {p.bedrooms || '-'}
      </span>
    )},
    { key: 'bathrooms', label: t('bathrooms'), render: (p: any) => (
      <span className="flex items-center gap-1">
        <Bath className="h-4 w-4" /> {p.bathrooms || '-'}
      </span>
    )},
    { key: 'rooms', label: t('totalRooms'), render: (p: any) => p.rooms || '-' },
    { key: 'area', label: t('totalArea'), render: (p: any) => formatArea(p.area) },
    { key: 'livingArea', label: t('livingArea'), render: (p: any) => formatArea(p.livingArea) },
    { key: 'kitchenArea', label: t('kitchenArea'), render: (p: any) => formatArea(p.kitchenArea) },
    { key: 'floor', label: t('floor'), render: (p: any) => (
      p.floor && p.totalFloors ? `${p.floor} / ${p.totalFloors}` : (p.floor || '-')
    )},
    { key: 'yearBuilt', label: tProp('details.yearBuilt'), render: (p: any) => (
      <span className="flex items-center gap-1">
        <Calendar className="h-4 w-4" /> {p.yearBuilt || '-'}
      </span>
    )},
    { key: 'buildingType', label: t('buildingType'), render: (p: any) => p.buildingType || '-' },
    { key: 'buildingClass', label: tProp('details.buildingClass'), render: (p: any) => (
      p.buildingClass ? <Badge variant="outline">{p.buildingClass}</Badge> : '-'
    )},
    { key: 'renovation', label: tProp('details.renovation'), render: (p: any) => p.renovation || '-' },
    { key: 'parking', label: t('parking'), render: (p: any) => (
      <span className="flex items-center gap-1">
        <Car className="h-4 w-4" /> {p.parking || '-'}
      </span>
    )},
    { key: 'balcony', label: t('balcony'), render: (p: any) => p.balcony || '-' },
    { key: 'furnished', label: t('furnished'), render: (p: any) => p.furnished || '-' },
  ]

  // Get all unique amenities from compared properties
  const allAmenities = [...new Set(properties.flatMap(p => p.amenities || []))]

  if (properties.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t('noProperties')}</h1>
            <p className="text-gray-500 mb-6">{t('noPropertiesDesc')}</p>
            <Link href="/properties">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('browseProperties')}
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-gray-500">{t('subtitle', { count: properties.length })}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/properties">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                {t('addMore')}
              </Button>
            </Link>
            <Button variant="outline" onClick={clearComparison}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t('clearAll')}
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Property Cards Row */}
            <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
              <div className="p-4" />
              {properties.map((property) => (
                <Card key={property.id} className="relative overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white"
                    onClick={() => removeFromComparison(property.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="relative h-40">
                    <Image
                      src={property.images[0] || '/placeholder-property.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-blue-600 text-white">
                        {property.listingType === 'SALE' ? tProp('listingTypes.sale') : tProp('listingTypes.rent')}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Link href={`/properties/${property.id}`} className="hover:text-blue-600">
                      <h3 className="font-semibold line-clamp-2 mb-1">{property.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-1">{property.address}</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      {formatPrice(property.price)}
                      {property.listingType === 'RENT' && <span className="text-sm font-normal">/mo</span>}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Rows */}
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <tbody>
                    {/* Main Attributes */}
                    <tr className="bg-gray-50">
                      <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-gray-700">
                        {t('basicInfo')}
                      </td>
                    </tr>
                    {attributes.map((attr, index) => (
                      <tr key={attr.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-[200px]">
                          {attr.label}
                        </td>
                        {properties.map((property) => (
                          <td key={property.id} className="px-4 py-3 text-sm">
                            {attr.render(property)}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Amenities Section */}
                    {allAmenities.length > 0 && (
                      <>
                        <tr className="bg-gray-50">
                          <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-gray-700">
                            {t('amenities')}
                          </td>
                        </tr>
                        {allAmenities.map((amenity, index) => (
                          <tr key={amenity} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-600">
                              {amenity.replace('_', ' ')}
                            </td>
                            {properties.map((property) => (
                              <td key={property.id} className="px-4 py-3 text-sm text-center">
                                {property.amenities?.includes(amenity) ? (
                                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <Minus className="h-5 w-5 text-gray-300 mx-auto" />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Actions Row */}
            <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
              <div />
              {properties.map((property) => (
                <div key={property.id} className="flex gap-2">
                  <Link href={`/properties/${property.id}`} className="flex-1">
                    <Button className="w-full">{t('viewDetails')}</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
