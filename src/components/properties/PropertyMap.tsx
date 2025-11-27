"use client"

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'

interface PropertyMapProps {
  latitude: number
  longitude: number
  title: string
  address: string
}

export function PropertyMap({ latitude, longitude, title, address }: PropertyMapProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    const loadMap = async () => {
      const L = await import('leaflet')
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet')

      // Fix for default marker icons in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      // Create the map component
      const Map = () => (
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]}>
            <Popup>
              <div className="text-sm">
                <strong>{title}</strong>
                <br />
                {address}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      )

      setMapComponent(() => Map)
    }

    loadMap()
  }, [latitude, longitude, title, address])

  if (!MapComponent) {
    return (
      <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 flex items-center gap-2">
          <MapPin className="h-5 w-5 animate-pulse" />
          Loading map...
        </div>
      </div>
    )
  }

  return (
    <div className="h-[300px] rounded-lg overflow-hidden border">
      <MapComponent />
    </div>
  )
}

// Wrapper component that only renders if coordinates exist
export function PropertyMapSection({
  latitude,
  longitude,
  title,
  address
}: {
  latitude?: number | null
  longitude?: number | null
  title: string
  address: string
}) {
  if (!latitude || !longitude) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-600" />
        Location
      </h3>
      <PropertyMap
        latitude={latitude}
        longitude={longitude}
        title={title}
        address={address}
      />
      <p className="text-sm text-gray-500">
        Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </p>
    </div>
  )
}
