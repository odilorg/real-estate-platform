import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { propertySchema } from '@/lib/validations/property'
import { getDataStore } from '@/lib/dataStore'

// GET /api/properties - List all properties
export async function GET() {
  try {
    const dataStore = getDataStore()
    const properties = dataStore.getAllProperties()
    return NextResponse.json(properties)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = propertySchema.parse(body)

    // Create property in data store
    const dataStore = getDataStore()
    const newProperty = dataStore.createProperty({
      ...validatedData,
      userId,
      country: validatedData.country || 'USA',
    })

    console.log('Property created:', newProperty)

    return NextResponse.json(newProperty, { status: 201 })
  } catch (error: any) {
    console.error('Error creating property:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}
