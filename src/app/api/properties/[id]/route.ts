import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getPropertyById, updateProperty, deleteProperty } from '@/lib/db'
import { propertySchema } from '@/lib/validations/property'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/properties/[id] - Get single property by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const property = await getPropertyById(id)

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if property exists
    const existingProperty = await getPropertyById(id)
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingProperty.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own properties' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = propertySchema.partial().parse(body)

    // Update property
    const updatedProperty = await updateProperty(id, validatedData)

    if (!updatedProperty) {
      return NextResponse.json(
        { error: 'Failed to update property' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedProperty)
  } catch (error: any) {
    console.error('Error updating property:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if property exists
    const existingProperty = await getPropertyById(id)
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingProperty.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own properties' },
        { status: 403 }
      )
    }

    // Delete property
    const deleted = await deleteProperty(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete property' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Property deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
