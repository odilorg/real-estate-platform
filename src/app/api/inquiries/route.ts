import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Create a new inquiry
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.user?.id
    const body = await request.json()

    const {
      propertyId,
      senderName,
      senderEmail,
      senderPhone,
      message,
      inquiryType = 'GENERAL',
    } = body

    // Validate required fields
    if (!propertyId || !senderName || !senderEmail || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the property to find the owner
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { userId: true, title: true },
    })

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      )
    }

    // Don't allow owners to inquire about their own property
    if (userId && userId === property.userId) {
      return NextResponse.json(
        { message: 'You cannot inquire about your own property' },
        { status: 400 }
      )
    }

    // Create the inquiry
    const inquiry = await prisma.propertyInquiry.create({
      data: {
        propertyId,
        ownerId: property.userId,
        senderId: userId || null,
        senderName,
        senderEmail,
        senderPhone: senderPhone || null,
        message,
        inquiryType,
        status: 'NEW',
      },
    })

    return NextResponse.json({
      inquiry,
      message: 'Inquiry sent successfully',
    })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { message: 'Failed to send inquiry' },
      { status: 500 }
    )
  }
}

// GET - Get inquiries for the current user (owner's properties)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const propertyId = searchParams.get('propertyId')

    // Build where clause
    const where: Record<string, unknown> = { ownerId: userId }
    if (status && status !== 'all') {
      where.status = status
    }
    if (propertyId) {
      where.propertyId = propertyId
    }

    const inquiries = await prisma.propertyInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Get property titles for each inquiry
    const propertyIds = [...new Set(inquiries.map(i => i.propertyId))]
    const properties = await prisma.property.findMany({
      where: { id: { in: propertyIds } },
      select: { id: true, title: true, images: { take: 1 } },
    })

    const propertyMap = new Map(properties.map(p => [p.id, p]))

    const inquiriesWithProperty = inquiries.map(inquiry => ({
      ...inquiry,
      property: propertyMap.get(inquiry.propertyId),
    }))

    // Get stats
    const stats = {
      total: await prisma.propertyInquiry.count({ where: { ownerId: userId } }),
      new: await prisma.propertyInquiry.count({ where: { ownerId: userId, status: 'NEW' } }),
      read: await prisma.propertyInquiry.count({ where: { ownerId: userId, status: 'READ' } }),
      responded: await prisma.propertyInquiry.count({ where: { ownerId: userId, status: 'RESPONDED' } }),
    }

    return NextResponse.json({ inquiries: inquiriesWithProperty, stats })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { message: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
