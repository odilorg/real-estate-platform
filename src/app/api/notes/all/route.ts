import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get all notes for the current user with property details
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notes = await prisma.propertyNote.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Fetch property details for each note
    const notesWithProperties = await Promise.all(
      notes.map(async (note) => {
        const property = await prisma.property.findUnique({
          where: { id: note.propertyId },
          select: {
            id: true,
            title: true,
            price: true,
            city: true,
            address: true,
            listingType: true,
            images: {
              select: { url: true },
              take: 1,
              orderBy: { order: 'asc' },
            },
          },
        })

        return {
          ...note,
          property: property ? {
            ...property,
            images: property.images.map(img => img.url),
          } : null,
        }
      })
    )

    // Filter out notes where property no longer exists
    const validNotes = notesWithProperties.filter(note => note.property !== null)

    return NextResponse.json({ notes: validNotes })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}
