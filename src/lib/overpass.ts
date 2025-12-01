/**
 * Overpass API Service
 * Fetches nearby places from OpenStreetMap using Overpass API
 * Free to use, no API key required
 */

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter'

// Categories of places we want to fetch
export interface NearbyPlace {
  id: number
  type: string // node, way, relation
  name: string
  category: PlaceCategory
  subcategory: string
  lat: number
  lon: number
  distance: number // meters from property
  tags?: Record<string, string>
}

export type PlaceCategory =
  | 'transport'
  | 'education'
  | 'healthcare'
  | 'shopping'
  | 'food'
  | 'leisure'
  | 'finance'

export interface NeighborhoodData {
  transport: NearbyPlace[]
  education: NearbyPlace[]
  healthcare: NearbyPlace[]
  shopping: NearbyPlace[]
  food: NearbyPlace[]
  leisure: NearbyPlace[]
  finance: NearbyPlace[]
  walkScore: number
  summary: NeighborhoodSummary
}

export interface NeighborhoodSummary {
  totalPlaces: number
  nearestMetro: NearbyPlace | null
  nearestSchool: NearbyPlace | null
  nearestHospital: NearbyPlace | null
  nearestSupermarket: NearbyPlace | null
  nearestPark: NearbyPlace | null
  hasGoodTransport: boolean
  hasSchoolsNearby: boolean
  hasHealthcareNearby: boolean
  hasShoppingNearby: boolean
}

// Overpass query to get all relevant POIs within radius
function buildOverpassQuery(lat: number, lon: number, radiusMeters: number = 1500): string {
  return `
    [out:json][timeout:25];
    (
      // Transport
      node["station"="subway"](around:${radiusMeters},${lat},${lon});
      node["railway"="station"](around:${radiusMeters},${lat},${lon});
      node["railway"="halt"](around:${radiusMeters},${lat},${lon});
      node["highway"="bus_stop"](around:${radiusMeters},${lat},${lon});
      node["amenity"="bus_station"](around:${radiusMeters},${lat},${lon});

      // Education
      node["amenity"="school"](around:${radiusMeters},${lat},${lon});
      way["amenity"="school"](around:${radiusMeters},${lat},${lon});
      node["amenity"="kindergarten"](around:${radiusMeters},${lat},${lon});
      way["amenity"="kindergarten"](around:${radiusMeters},${lat},${lon});
      node["amenity"="university"](around:${radiusMeters},${lat},${lon});
      way["amenity"="university"](around:${radiusMeters},${lat},${lon});
      node["amenity"="college"](around:${radiusMeters},${lat},${lon});
      way["amenity"="college"](around:${radiusMeters},${lat},${lon});

      // Healthcare
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
      node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
      node["amenity"="doctors"](around:${radiusMeters},${lat},${lon});
      node["amenity"="dentist"](around:${radiusMeters},${lat},${lon});

      // Shopping
      node["shop"="supermarket"](around:${radiusMeters},${lat},${lon});
      way["shop"="supermarket"](around:${radiusMeters},${lat},${lon});
      node["shop"="mall"](around:${radiusMeters},${lat},${lon});
      way["shop"="mall"](around:${radiusMeters},${lat},${lon});
      node["shop"="convenience"](around:${radiusMeters},${lat},${lon});
      node["amenity"="marketplace"](around:${radiusMeters},${lat},${lon});
      way["amenity"="marketplace"](around:${radiusMeters},${lat},${lon});

      // Food & Drink
      node["amenity"="restaurant"](around:${radiusMeters},${lat},${lon});
      node["amenity"="cafe"](around:${radiusMeters},${lat},${lon});
      node["amenity"="fast_food"](around:${radiusMeters},${lat},${lon});

      // Leisure
      node["leisure"="park"](around:${radiusMeters},${lat},${lon});
      way["leisure"="park"](around:${radiusMeters},${lat},${lon});
      node["leisure"="playground"](around:${radiusMeters},${lat},${lon});
      way["leisure"="playground"](around:${radiusMeters},${lat},${lon});
      node["leisure"="fitness_centre"](around:${radiusMeters},${lat},${lon});
      way["leisure"="fitness_centre"](around:${radiusMeters},${lat},${lon});
      node["leisure"="sports_centre"](around:${radiusMeters},${lat},${lon});
      way["leisure"="sports_centre"](around:${radiusMeters},${lat},${lon});
      node["leisure"="swimming_pool"](around:${radiusMeters},${lat},${lon});

      // Finance
      node["amenity"="bank"](around:${radiusMeters},${lat},${lon});
      node["amenity"="atm"](around:${radiusMeters},${lat},${lon});
    );
    out center;
  `
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

// Determine category and subcategory from OSM tags
function categorizePlace(tags: Record<string, string>): { category: PlaceCategory, subcategory: string } {
  // Transport
  if (tags.station === 'subway' || tags.railway === 'station' || tags.railway === 'halt') {
    return { category: 'transport', subcategory: tags.station === 'subway' ? 'metro' : 'train' }
  }
  if (tags.highway === 'bus_stop' || tags.amenity === 'bus_station') {
    return { category: 'transport', subcategory: 'bus' }
  }

  // Education
  if (tags.amenity === 'school') return { category: 'education', subcategory: 'school' }
  if (tags.amenity === 'kindergarten') return { category: 'education', subcategory: 'kindergarten' }
  if (tags.amenity === 'university') return { category: 'education', subcategory: 'university' }
  if (tags.amenity === 'college') return { category: 'education', subcategory: 'college' }

  // Healthcare
  if (tags.amenity === 'hospital') return { category: 'healthcare', subcategory: 'hospital' }
  if (tags.amenity === 'clinic') return { category: 'healthcare', subcategory: 'clinic' }
  if (tags.amenity === 'pharmacy') return { category: 'healthcare', subcategory: 'pharmacy' }
  if (tags.amenity === 'doctors') return { category: 'healthcare', subcategory: 'doctors' }
  if (tags.amenity === 'dentist') return { category: 'healthcare', subcategory: 'dentist' }

  // Shopping
  if (tags.shop === 'supermarket') return { category: 'shopping', subcategory: 'supermarket' }
  if (tags.shop === 'mall') return { category: 'shopping', subcategory: 'mall' }
  if (tags.shop === 'convenience') return { category: 'shopping', subcategory: 'convenience' }
  if (tags.amenity === 'marketplace') return { category: 'shopping', subcategory: 'market' }

  // Food
  if (tags.amenity === 'restaurant') return { category: 'food', subcategory: 'restaurant' }
  if (tags.amenity === 'cafe') return { category: 'food', subcategory: 'cafe' }
  if (tags.amenity === 'fast_food') return { category: 'food', subcategory: 'fast_food' }

  // Leisure
  if (tags.leisure === 'park') return { category: 'leisure', subcategory: 'park' }
  if (tags.leisure === 'playground') return { category: 'leisure', subcategory: 'playground' }
  if (tags.leisure === 'fitness_centre') return { category: 'leisure', subcategory: 'gym' }
  if (tags.leisure === 'sports_centre') return { category: 'leisure', subcategory: 'sports' }
  if (tags.leisure === 'swimming_pool') return { category: 'leisure', subcategory: 'pool' }

  // Finance
  if (tags.amenity === 'bank') return { category: 'finance', subcategory: 'bank' }
  if (tags.amenity === 'atm') return { category: 'finance', subcategory: 'atm' }

  return { category: 'leisure', subcategory: 'other' }
}

// Get display name from tags (prioritize local names)
function getPlaceName(tags: Record<string, string>, subcategory: string): string {
  return tags['name:ru'] ||
         tags['name:uz'] ||
         tags.name ||
         tags.operator ||
         getDefaultName(subcategory)
}

function getDefaultName(subcategory: string): string {
  const defaults: Record<string, string> = {
    metro: 'Станция метро',
    train: 'Ж/Д станция',
    bus: 'Автобусная остановка',
    school: 'Школа',
    kindergarten: 'Детский сад',
    university: 'Университет',
    college: 'Колледж',
    hospital: 'Больница',
    clinic: 'Поликлиника',
    pharmacy: 'Аптека',
    doctors: 'Врачебный кабинет',
    dentist: 'Стоматология',
    supermarket: 'Супермаркет',
    mall: 'Торговый центр',
    convenience: 'Магазин',
    market: 'Рынок',
    restaurant: 'Ресторан',
    cafe: 'Кафе',
    fast_food: 'Фастфуд',
    park: 'Парк',
    playground: 'Детская площадка',
    gym: 'Фитнес-центр',
    sports: 'Спортивный центр',
    pool: 'Бассейн',
    bank: 'Банк',
    atm: 'Банкомат',
  }
  return defaults[subcategory] || subcategory
}

// Calculate walk score based on nearby amenities
function calculateWalkScore(data: Omit<NeighborhoodData, 'walkScore' | 'summary'>): number {
  let score = 0
  const maxScore = 100

  // Transport (max 25 points)
  const hasMetro = data.transport.some(p => p.subcategory === 'metro' && p.distance < 1000)
  const hasBus = data.transport.some(p => p.subcategory === 'bus' && p.distance < 500)
  if (hasMetro) score += 20
  else if (data.transport.some(p => p.subcategory === 'metro' && p.distance < 1500)) score += 12
  if (hasBus) score += 5

  // Shopping (max 25 points)
  const hasSupermarket = data.shopping.some(p => p.subcategory === 'supermarket' && p.distance < 500)
  const hasConvenience = data.shopping.some(p => p.distance < 300)
  if (hasSupermarket) score += 15
  else if (data.shopping.some(p => p.subcategory === 'supermarket' && p.distance < 1000)) score += 8
  if (hasConvenience) score += 5
  if (data.shopping.length >= 5) score += 5

  // Education (max 15 points)
  const hasSchool = data.education.some(p => p.subcategory === 'school' && p.distance < 1000)
  const hasKindergarten = data.education.some(p => p.subcategory === 'kindergarten' && p.distance < 800)
  if (hasSchool) score += 8
  if (hasKindergarten) score += 7

  // Healthcare (max 15 points)
  const hasPharmacy = data.healthcare.some(p => p.subcategory === 'pharmacy' && p.distance < 500)
  const hasClinic = data.healthcare.some(p => ['clinic', 'hospital', 'doctors'].includes(p.subcategory) && p.distance < 1500)
  if (hasPharmacy) score += 8
  if (hasClinic) score += 7

  // Leisure (max 10 points)
  const hasPark = data.leisure.some(p => p.subcategory === 'park' && p.distance < 800)
  const hasPlayground = data.leisure.some(p => p.subcategory === 'playground' && p.distance < 500)
  if (hasPark) score += 5
  if (hasPlayground) score += 3
  if (data.leisure.length >= 3) score += 2

  // Food (max 10 points)
  if (data.food.length >= 5) score += 5
  else if (data.food.length >= 2) score += 3
  if (data.food.some(p => p.distance < 300)) score += 5

  return Math.min(score, maxScore)
}

// Generate summary from data
function generateSummary(data: Omit<NeighborhoodData, 'walkScore' | 'summary'>): NeighborhoodSummary {
  const findNearest = (places: NearbyPlace[], subcategories?: string[]): NearbyPlace | null => {
    const filtered = subcategories
      ? places.filter(p => subcategories.includes(p.subcategory))
      : places
    return filtered.sort((a, b) => a.distance - b.distance)[0] || null
  }

  const totalPlaces = Object.values(data).reduce((sum, arr) => sum + arr.length, 0)

  return {
    totalPlaces,
    nearestMetro: findNearest(data.transport, ['metro', 'train']),
    nearestSchool: findNearest(data.education, ['school']),
    nearestHospital: findNearest(data.healthcare, ['hospital', 'clinic']),
    nearestSupermarket: findNearest(data.shopping, ['supermarket', 'mall']),
    nearestPark: findNearest(data.leisure, ['park']),
    hasGoodTransport: data.transport.some(p => p.subcategory === 'metro' && p.distance < 1500) ||
                      data.transport.filter(p => p.subcategory === 'bus').length >= 2,
    hasSchoolsNearby: data.education.filter(p => p.subcategory === 'school').length >= 1,
    hasHealthcareNearby: data.healthcare.length >= 2,
    hasShoppingNearby: data.shopping.length >= 3,
  }
}

// Main function to fetch neighborhood data
export async function fetchNeighborhoodData(
  lat: number,
  lon: number,
  radiusMeters: number = 1500
): Promise<NeighborhoodData> {
  const query = buildOverpassQuery(lat, lon, radiusMeters)

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`)
    }

    const result = await response.json()

    // Initialize data structure
    const data: Omit<NeighborhoodData, 'walkScore' | 'summary'> = {
      transport: [],
      education: [],
      healthcare: [],
      shopping: [],
      food: [],
      leisure: [],
      finance: [],
    }

    // Process elements
    for (const element of result.elements) {
      const tags = element.tags || {}

      // Skip elements without useful tags
      if (Object.keys(tags).length === 0) continue

      const { category, subcategory } = categorizePlace(tags)

      // Get coordinates (for ways, use center point)
      const placeLat = element.lat || element.center?.lat
      const placeLon = element.lon || element.center?.lon

      if (!placeLat || !placeLon) continue

      const distance = calculateDistance(lat, lon, placeLat, placeLon)
      const name = getPlaceName(tags, subcategory)

      const place: NearbyPlace = {
        id: element.id,
        type: element.type,
        name,
        category,
        subcategory,
        lat: placeLat,
        lon: placeLon,
        distance,
        tags,
      }

      data[category].push(place)
    }

    // Sort each category by distance
    for (const category of Object.keys(data) as PlaceCategory[]) {
      data[category].sort((a, b) => a.distance - b.distance)
    }

    // Limit results per category to avoid huge responses
    const limitedData = {
      transport: data.transport.slice(0, 10),
      education: data.education.slice(0, 8),
      healthcare: data.healthcare.slice(0, 8),
      shopping: data.shopping.slice(0, 10),
      food: data.food.slice(0, 15),
      leisure: data.leisure.slice(0, 8),
      finance: data.finance.slice(0, 5),
    }

    const walkScore = calculateWalkScore(limitedData)
    const summary = generateSummary(limitedData)

    return {
      ...limitedData,
      walkScore,
      summary,
    }
  } catch (error) {
    console.error('Failed to fetch neighborhood data:', error)

    // Return empty data on error
    return {
      transport: [],
      education: [],
      healthcare: [],
      shopping: [],
      food: [],
      leisure: [],
      finance: [],
      walkScore: 0,
      summary: {
        totalPlaces: 0,
        nearestMetro: null,
        nearestSchool: null,
        nearestHospital: null,
        nearestSupermarket: null,
        nearestPark: null,
        hasGoodTransport: false,
        hasSchoolsNearby: false,
        hasHealthcareNearby: false,
        hasShoppingNearby: false,
      },
    }
  }
}

// Format distance for display
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} м`
  }
  return `${(meters / 1000).toFixed(1)} км`
}

// Estimate walking time (average 5 km/h = 83 m/min)
export function estimateWalkingTime(meters: number): number {
  return Math.round(meters / 83)
}

// Get walk score label
export function getWalkScoreLabel(score: number): { label: string, color: string } {
  if (score >= 90) return { label: 'Идеально для пешеходов', color: 'green' }
  if (score >= 70) return { label: 'Очень удобно', color: 'green' }
  if (score >= 50) return { label: 'Удобно', color: 'yellow' }
  if (score >= 25) return { label: 'Зависит от машины', color: 'orange' }
  return { label: 'Требуется машина', color: 'red' }
}
