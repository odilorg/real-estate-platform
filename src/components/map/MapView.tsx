"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { MockProperty } from '@/lib/mockData'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface MapViewProps {
  properties: MockProperty[]
  center?: [number, number]
  zoom?: number
  height?: string
  onMarkerClick?: (property: MockProperty) => void
}

export function MapView({
  properties,
  center = [40.7128, -74.006], // Default to NYC
  zoom = 12,
  height = '400px',
  onMarkerClick,
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    import('leaflet').then((leaflet) => {
      setL(leaflet.default)

      // Fix for default marker icons
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
    })
  }, [])

  // Calculate center based on properties if available
  const mapCenter = properties.length > 0
    ? [
        properties.reduce((sum, p) => sum + (p.latitude || 0), 0) / properties.length,
        properties.reduce((sum, p) => sum + (p.longitude || 0), 0) / properties.length,
      ] as [number, number]
    : center

  if (!isClient || !L) {
    return (
      <div
        style={{ height }}
        className="w-full bg-gray-100 rounded-lg flex items-center justify-center"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
      />
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => {
          if (!property.latitude || !property.longitude) return null

          return (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              eventHandlers={{
                click: () => onMarkerClick?.(property),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">
                    {property.address}, {property.city}
                  </p>
                  <p className="text-sm font-bold text-blue-600">
                    ${property.price.toLocaleString()}
                    {property.listingType === 'RENT' && <span className="text-xs">/mo</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sqft
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </>
  )
}
