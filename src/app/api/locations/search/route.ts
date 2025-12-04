import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/locations/search?q=таш&type=CITY,DISTRICT
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")?.trim() || ""
    const queryLower = query.toLowerCase()
    const types = searchParams.get("type")?.split(",") || []
    const limit = parseInt(searchParams.get("limit") || "20")
    const popular = searchParams.get("popular") === "true"

    // If no query, return popular locations
    if (!query && popular) {
      const popularLocations = await prisma.location.findMany({
        where: {
          isPopular: true,
        },
        orderBy: [
          { type: "asc" },
          { population: "desc" },
        ],
        take: limit,
      })

      return NextResponse.json({
        results: groupByType(popularLocations),
        total: popularLocations.length,
      })
    }

    // If no query at all, return empty
    if (!query) {
      return NextResponse.json({ results: {}, total: 0 })
    }

    // For SQLite, we need to fetch all and filter in JS for case-insensitive search
    // In production with PostgreSQL, use ilike or citext
    let whereClause: any = {}

    // Filter by type if specified
    if (types.length > 0) {
      whereClause.type = { in: types }
    }

    const allLocations = await prisma.location.findMany({
      where: whereClause,
      include: {
        parent: {
          select: {
            id: true,
            name_ru: true,
            name_uz: true,
            type: true,
          },
        },
        _count: {
          select: {
            properties: true,
          },
        },
      },
      orderBy: [
        { isPopular: "desc" },
        { population: "desc" },
        { name_ru: "asc" },
      ],
    })

    // Filter in JS for case-insensitive matching
    const locations = allLocations.filter(loc => {
      const nameRuLower = loc.name_ru.toLowerCase()
      const nameUzLower = loc.name_uz.toLowerCase()
      const nameEnLower = (loc.name_en || "").toLowerCase()
      const idLower = loc.id.toLowerCase()

      return nameRuLower.includes(queryLower) ||
             nameUzLower.includes(queryLower) ||
             nameEnLower.includes(queryLower) ||
             idLower.includes(queryLower)
    }).slice(0, limit)

    // Group results by type
    const groupedResults = groupByType(locations)

    return NextResponse.json({
      results: groupedResults,
      total: locations.length,
    })
  } catch (error) {
    console.error("Location search error:", error)
    return NextResponse.json(
      { error: "Failed to search locations" },
      { status: 500 }
    )
  }
}

// Helper to group locations by type
function groupByType(locations: any[]) {
  const groups: Record<string, any[]> = {
    CITY: [],
    DISTRICT: [],
    METRO: [],
    RESIDENTIAL_COMPLEX: [],
    REGION: [],
  }

  for (const loc of locations) {
    if (groups[loc.type]) {
      groups[loc.type].push({
        id: loc.id,
        type: loc.type,
        name_ru: loc.name_ru,
        name_uz: loc.name_uz,
        name_en: loc.name_en,
        parent: loc.parent,
        propertyCount: loc._count?.properties || 0,
        isPopular: loc.isPopular,
      })
    }
  }

  // Remove empty groups
  for (const key of Object.keys(groups)) {
    if (groups[key].length === 0) {
      delete groups[key]
    }
  }

  return groups
}
