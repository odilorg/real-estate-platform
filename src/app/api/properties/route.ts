import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { propertySchema } from '@/lib/validations/property'
import { mockProperties } from '@/lib/mockData'

// GET /api/properties - List all properties
export async function GET() {
  try {
    // Return mock properties for now
    // Later: Replace with database query
    return NextResponse.json(mockProperties)
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

    // Create new property object
    const newProperty = {
      id: String(mockProperties.length + 1), // Simple ID generation
      ...validatedData,
      createdAt: new Date(),
    }

    // For now, we'll just return the created property
    // Later: Save to database using Prisma
    // await prisma.property.create({ data: newProperty })

    // Simulate saving (in production, this would be in database)
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
