"use client"

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Property } from '@/types'
import Image from 'next/image'

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
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
)

interface MapViewProps {
  properties: Property[]
  center?: [number, number]
  zoom?: number
  height?: string
  onMarkerClick?: (property: Property) => void
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void
  selectedPropertyId?: string
  showPropertyCards?: boolean
}

export function MapView({
  properties,
  center = [40.7128, -74.006], // Default to NYC
  zoom = 12,
  height = '400px',
  onMarkerClick,
  onBoundsChange,
  selectedPropertyId,
  showPropertyCards = true,
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)
  const [customIcon, setCustomIcon] = useState<any>(null)
  const [selectedIcon, setSelectedIcon] = useState<any>(null)

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

      // Create custom blue dot icon
      const blueIcon = leaflet.default.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 24px;
          height: 24px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
      setCustomIcon(blueIcon)

      // Create selected (larger) icon
      const selectedMarkerIcon = leaflet.default.divIcon({
        className: 'custom-marker-selected',
        html: `<div style="
          width: 32px;
          height: 32px;
          background: #1d4ed8;
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })
      setSelectedIcon(selectedMarkerIcon)
    })
  }, [])

  // Calculate center based on properties if available
  const mapCenter = properties.length > 0
    ? [
        properties.reduce((sum, p) => sum + (p.latitude || 0), 0) / properties.length,
        properties.reduce((sum, p) => sum + (p.longitude || 0), 0) / properties.length,
      ] as [number, number]
    : center

  const formatPrice = (price: number, listingType: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
    return listingType === 'RENT' ? `${formatted}/mo` : formatted
  }

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
      <style>{`
        .custom-marker, .custom-marker-selected {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          min-width: 200px;
        }
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-tooltip {
          padding: 0 !important;
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .leaflet-tooltip-top:before,
        .leaflet-tooltip-bottom:before,
        .leaflet-tooltip-left:before,
        .leaflet-tooltip-right:before {
          display: none !important;
        }
        .property-tooltip {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          overflow: hidden;
          min-width: 220px;
        }
      `}</style>
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

          const isSelected = property.id === selectedPropertyId
          const icon = isSelected && selectedIcon ? selectedIcon : (customIcon || undefined)

          return (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onMarkerClick?.(property),
              }}
            >
              {/* Hover Tooltip */}
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="property-tooltip">
                  {property.images && property.images[0] && (
                    <div className="relative h-24 w-full">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                        {property.listingType === 'SALE' ? 'Sale' : 'Rent'}
                      </div>
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-base font-bold text-blue-600">
                      {formatPrice(property.price, property.listingType)}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{property.address}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      {property.bedrooms !== null && <span>{property.bedrooms} bed</span>}
                      {property.area && <span>• {property.area} m²</span>}
                    </div>
                  </div>
                </div>
              </Tooltip>

              {/* Click Popup (more detailed) */}
              {showPropertyCards && (
                <Popup>
                  <div className="w-56">
                    {property.images && property.images[0] && (
                      <div className="relative h-32 w-full">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                          {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                        </div>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-lg font-bold text-blue-600 mb-1">
                        {formatPrice(property.price, property.listingType)}
                      </p>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{property.title}</h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                        {property.address}, {property.city}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        {property.bedrooms && <span>{property.bedrooms} bed</span>}
                        {property.bathrooms && <span>{property.bathrooms} bath</span>}
                        {property.area && <span>{property.area} sqft</span>}
                      </div>
                    </div>
                  </div>
                </Popup>
              )}
            </Marker>
          )
        })}
      </MapContainer>
    </>
  )
}
