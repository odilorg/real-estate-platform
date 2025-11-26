import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { propertySchema } from '@/lib/validations/property'
import { getAllProperties, createProperty } from '@/lib/db'

// GET /api/properties - List all properties
export async function GET() {
  try {
    const properties = await getAllProperties()
    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
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

    // Create property in database
    const newProperty = await createProperty({
      ...validatedData,
      userId,
      country: validatedData.country || 'USA',
    })

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
