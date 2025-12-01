"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with webpack
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

interface LocationPickerMapProps {
  position: { lat: number; lng: number } | null
  defaultCenter: { lat: number; lng: number }
  onMapClick: (lat: number, lng: number) => void
}

export default function LocationPickerMap({
  position,
  defaultCenter,
  onMapClick,
}: LocationPickerMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Initialize map
    const map = L.map(containerRef.current, {
      center: position || defaultCenter,
      zoom: position ? 16 : 12,
      zoomControl: true,
    })

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Add click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    })

    mapRef.current = map

    // Add initial marker if position exists
    if (position) {
      markerRef.current = L.marker([position.lat, position.lng], {
        draggable: true,
      }).addTo(map)

      // Handle marker drag
      markerRef.current.on('dragend', () => {
        const latlng = markerRef.current?.getLatLng()
        if (latlng) {
          onMapClick(latlng.lat, latlng.lng)
        }
      })
    }

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, []) // Only run once on mount

  // Update marker when position changes
  useEffect(() => {
    if (!mapRef.current) return

    if (position) {
      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setLatLng([position.lat, position.lng])
      } else {
        markerRef.current = L.marker([position.lat, position.lng], {
          draggable: true,
        }).addTo(mapRef.current)

        markerRef.current.on('dragend', () => {
          const latlng = markerRef.current?.getLatLng()
          if (latlng) {
            onMapClick(latlng.lat, latlng.lng)
          }
        })
      }

      // Pan to new position
      mapRef.current.setView([position.lat, position.lng], 16, {
        animate: true,
      })
    } else if (markerRef.current) {
      // Remove marker if position is cleared
      markerRef.current.remove()
      markerRef.current = null
    }
  }, [position, onMapClick])

  return (
    <div
      ref={containerRef}
      className="h-[300px] w-full"
      style={{ cursor: 'crosshair' }}
    />
  )
}
