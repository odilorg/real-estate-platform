import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET - Get single inquiry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const inquiry = await prisma.propertyInquiry.findUnique({
      where: { id },
    })

    if (!inquiry) {
      return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 })
    }

    // Only owner or sender can view
    if (inquiry.ownerId !== userId && inquiry.senderId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Get property info
    const property = await prisma.property.findUnique({
      where: { id: inquiry.propertyId },
      select: { id: true, title: true, images: { take: 1 }, address: true, price: true },
    })

    return NextResponse.json({ inquiry: { ...inquiry, property } })
  } catch (error) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json(
      { message: 'Failed to fetch inquiry' },
      { status: 500 }
    )
  }
}

// PATCH - Update inquiry (mark as read, respond, archive)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const inquiry = await prisma.propertyInquiry.findUnique({
      where: { id },
    })

    if (!inquiry) {
      return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 })
    }

    // Only owner can update
    if (inquiry.ownerId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status, response } = body

    const updateData: Record<string, unknown> = {}

    if (status) {
      updateData.status = status
    }

    if (response !== undefined) {
      updateData.response = response
      updateData.respondedAt = new Date()
      updateData.status = 'RESPONDED'
    }

    // Auto-mark as READ when viewed
    if (inquiry.status === 'NEW' && !updateData.status) {
      updateData.status = 'READ'
    }

    const updatedInquiry = await prisma.propertyInquiry.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ inquiry: updatedInquiry })
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { message: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

// DELETE - Delete inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const inquiry = await prisma.propertyInquiry.findUnique({
      where: { id },
    })

    if (!inquiry) {
      return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 })
    }

    // Only owner can delete
    if (inquiry.ownerId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await prisma.propertyInquiry.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Inquiry deleted' })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json(
      { message: 'Failed to delete inquiry' },
      { status: 500 }
    )
  }
}
