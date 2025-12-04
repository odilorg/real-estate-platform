"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useTranslations, useLocale } from "next-intl"
import { MapPin, Building2, Train, Home, X, ChevronRight, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Location {
  id: string
  type: string
  name_ru: string
  name_uz: string
  name_en?: string
  parent?: {
    id: string
    name_ru: string
    name_uz: string
    type: string
  }
  propertyCount: number
  isPopular: boolean
}

interface LocationSearchResults {
  CITY?: Location[]
  DISTRICT?: Location[]
  METRO?: Location[]
  RESIDENTIAL_COMPLEX?: Location[]
  REGION?: Location[]
}

// Props for single location selection (new API)
interface SingleLocationProps {
  mode?: "single"
  value?: string
  locationId?: string
  onChange: (locationId: string | null, displayName: string) => void
  placeholder?: string
  className?: string
}

// Props for multi-location selection (legacy API for compatibility)
interface MultiLocationProps {
  mode: "multi"
  onLocationSelect: (location: {
    name: string
    lat: number
    lon: number
    city?: string
    state?: string
    locationId?: string
  }) => void
  selectedLocations: Array<{
    name: string
    lat: number
    lon: number
    locationId?: string
  }>
  onRemoveLocation: (index: number) => void
  placeholder?: string
  className?: string
}

type LocationSearchProps = SingleLocationProps | MultiLocationProps

const TYPE_ICONS: Record<string, React.ReactNode> = {
  CITY: <Building2 className="h-4 w-4" />,
  DISTRICT: <MapPin className="h-4 w-4" />,
  METRO: <Train className="h-4 w-4" />,
  RESIDENTIAL_COMPLEX: <Home className="h-4 w-4" />,
  REGION: <MapPin className="h-4 w-4" />,
}

const TYPE_LABELS: Record<string, { ru: string; uz: string }> = {
  CITY: { ru: "Город", uz: "Shahar" },
  DISTRICT: { ru: "Район", uz: "Tuman" },
  METRO: { ru: "Метро", uz: "Metro" },
  RESIDENTIAL_COMPLEX: { ru: "ЖК", uz: "TM" },
  REGION: { ru: "Область", uz: "Viloyat" },
}

export function LocationSearch(props: LocationSearchProps) {
  const t = useTranslations("search")
  const locale = useLocale()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<LocationSearchResults>({})
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  const isMultiMode = "mode" in props && props.mode === "multi"

  // Get display name based on locale
  const getDisplayName = useCallback((loc: Location) => {
    return locale === "ru" ? loc.name_ru : loc.name_uz
  }, [locale])

  const getParentName = useCallback((parent: Location["parent"]) => {
    if (!parent) return ""
    return locale === "ru" ? parent.name_ru : parent.name_uz
  }, [locale])

  const getTypeLabel = useCallback((type: string) => {
    return TYPE_LABELS[type]?.[locale as "ru" | "uz"] || type
  }, [locale])

  // Fetch locations from our database
  const fetchLocations = useCallback(async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) {
        params.set("q", searchQuery)
      } else {
        params.set("popular", "true")
      }
      params.set("limit", "20")

      const response = await fetch(`/api/locations/search?${params}`)
      const data = await response.json()
      setResults(data.results || {})
    } catch (error) {
      console.error("Failed to fetch locations:", error)
      setResults({})
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (isOpen) {
        fetchLocations(query)
      }
    }, 200)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, isOpen, fetchLocations])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle location selection
  const handleSelect = (location: Location) => {
    const displayName = getDisplayName(location)

    if (isMultiMode) {
      const multiProps = props as MultiLocationProps
      // Legacy multi-location mode
      multiProps.onLocationSelect({
        name: displayName,
        lat: 0, // We don't have lat/lon for all locations
        lon: 0,
        city: location.type === "CITY" ? displayName : undefined,
        locationId: location.id,
      })
    } else {
      const singleProps = props as SingleLocationProps
      singleProps.onChange(location.id, displayName)
    }

    setQuery("")
    setIsOpen(false)
  }

  // Handle clear
  const handleClear = () => {
    if (!isMultiMode) {
      const singleProps = props as SingleLocationProps
      singleProps.onChange(null, "")
    }
    setQuery("")
    inputRef.current?.focus()
  }

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true)
    if (!query) {
      fetchLocations("")
    }
  }

  // Check if results are empty
  const hasResults = Object.values(results).some(arr => arr && arr.length > 0)

  // Get placeholder
  const placeholder = props.placeholder || (locale === "ru" ? "Город, район, метро или ЖК" : "Shahar, tuman, metro yoki TM")

  return (
    <div className={cn("space-y-2", props.className)}>
      {/* Selected location tags (multi-mode only) */}
      {isMultiMode && (props as MultiLocationProps).selectedLocations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(props as MultiLocationProps).selectedLocations.map((location, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>{location.name}</span>
              <button
                onClick={() => (props as MultiLocationProps).onRemoveLocation(index)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder}
            className="w-full h-10 pl-9 pr-8 rounded-md border border-input bg-background text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                       placeholder:text-muted-foreground"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {!isLoading && query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full
                         hover:bg-muted text-muted-foreground hover:text-foreground
                         transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-lg
                       shadow-lg max-h-[400px] overflow-y-auto"
          >
            {isLoading && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                {locale === "ru" ? "Загрузка..." : "Yuklanmoqda..."}
              </div>
            )}

            {!isLoading && !hasResults && query && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                {locale === "ru" ? "Ничего не найдено" : "Hech narsa topilmadi"}
              </div>
            )}

            {!isLoading && hasResults && (
              <div className="py-2">
                {/* Cities */}
                {results.CITY && results.CITY.length > 0 && (
                  <LocationGroup
                    locations={results.CITY}
                    label={getTypeLabel("CITY")}
                    icon={TYPE_ICONS.CITY}
                    getDisplayName={getDisplayName}
                    getParentName={getParentName}
                    onSelect={handleSelect}
                  />
                )}

                {/* Districts */}
                {results.DISTRICT && results.DISTRICT.length > 0 && (
                  <LocationGroup
                    locations={results.DISTRICT}
                    label={getTypeLabel("DISTRICT")}
                    icon={TYPE_ICONS.DISTRICT}
                    getDisplayName={getDisplayName}
                    getParentName={getParentName}
                    onSelect={handleSelect}
                  />
                )}

                {/* Metro */}
                {results.METRO && results.METRO.length > 0 && (
                  <LocationGroup
                    locations={results.METRO}
                    label={getTypeLabel("METRO")}
                    icon={TYPE_ICONS.METRO}
                    getDisplayName={getDisplayName}
                    getParentName={getParentName}
                    onSelect={handleSelect}
                  />
                )}

                {/* Residential Complexes */}
                {results.RESIDENTIAL_COMPLEX && results.RESIDENTIAL_COMPLEX.length > 0 && (
                  <LocationGroup
                    locations={results.RESIDENTIAL_COMPLEX}
                    label={getTypeLabel("RESIDENTIAL_COMPLEX")}
                    icon={TYPE_ICONS.RESIDENTIAL_COMPLEX}
                    getDisplayName={getDisplayName}
                    getParentName={getParentName}
                    onSelect={handleSelect}
                  />
                )}

                {/* Regions */}
                {results.REGION && results.REGION.length > 0 && (
                  <LocationGroup
                    locations={results.REGION}
                    label={getTypeLabel("REGION")}
                    icon={TYPE_ICONS.REGION}
                    getDisplayName={getDisplayName}
                    getParentName={getParentName}
                    onSelect={handleSelect}
                  />
                )}
              </div>
            )}

            {/* Popular locations hint when empty */}
            {!isLoading && !query && hasResults && (
              <div className="px-3 py-2 text-xs text-muted-foreground border-t">
                {locale === "ru" ? "Популярные места" : "Mashhur joylar"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Location group component
interface LocationGroupProps {
  locations: Location[]
  label: string
  icon: React.ReactNode
  getDisplayName: (loc: Location) => string
  getParentName: (parent: Location["parent"]) => string
  onSelect: (location: Location) => void
}

function LocationGroup({
  locations,
  label,
  icon,
  getDisplayName,
  getParentName,
  onSelect,
}: LocationGroupProps) {
  return (
    <div>
      {/* Group header */}
      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
        {icon}
        {label}
      </div>

      {/* Location items */}
      {locations.map((location) => (
        <button
          key={location.id}
          type="button"
          onClick={() => onSelect(location)}
          className="w-full px-3 py-2 text-left hover:bg-muted/50 flex items-center gap-3
                     transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {getDisplayName(location)}
            </div>
            {location.parent && (
              <div className="text-xs text-muted-foreground truncate">
                {getParentName(location.parent)}
              </div>
            )}
          </div>
          {location.propertyCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {location.propertyCount}
            </span>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  )
}

export default LocationSearch
