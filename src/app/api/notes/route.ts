import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Get note for a property
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
    }

    const note = await prisma.propertyNote.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    })

    return NextResponse.json({ note })
  } catch (error) {
    console.error('Error fetching note:', error)
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 })
  }
}

// POST - Create or update note
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { propertyId, content } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
    }

    // Upsert - create if not exists, update if exists
    const note = await prisma.propertyNote.upsert({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
      update: {
        content: content || '',
      },
      create: {
        userId: session.user.id,
        propertyId,
        content: content || '',
      },
    })

    return NextResponse.json({ note })
  } catch (error) {
    console.error('Error saving note:', error)
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 })
  }
}

// DELETE - Delete note
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
    }

    await prisma.propertyNote.delete({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}
