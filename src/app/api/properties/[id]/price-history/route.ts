import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const priceHistory = await prisma.priceHistory.findMany({
      where: { propertyId: id },
      orderBy: { changedAt: 'asc' },
    })

    // If no history exists, get current price from property
    if (priceHistory.length === 0) {
      const property = await prisma.property.findUnique({
        where: { id },
        select: { price: true, createdAt: true },
      })

      if (property) {
        return NextResponse.json({
          history: [
            {
              id: 'initial',
              propertyId: id,
              price: property.price,
              changeType: 'INITIAL',
              changedAt: property.createdAt,
            },
          ],
        })
      }
    }

    return NextResponse.json({ history: priceHistory })
  } catch (error) {
    console.error('Error fetching price history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    )
  }
}
