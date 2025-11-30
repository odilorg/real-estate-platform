"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'

interface PropertyPDFProps {
  property: {
    id: string
    title: string
    description: string
    price: number
    listingType: string
    propertyType: string
    address: string
    city: string
    state?: string | null
    country: string
    bedrooms?: number | null
    bathrooms?: number | null
    area?: number | null
    livingArea?: number | null
    kitchenArea?: number | null
    rooms?: number | null
    floor?: number | null
    totalFloors?: number | null
    yearBuilt?: number | null
    parking?: number | null
    balcony?: number | null
    buildingType?: string | null
    buildingClass?: string | null
    renovation?: string | null
    furnished?: string | null
    nearestMetro?: string | null
    metroDistance?: number | null
    images: string[]
    amenities?: string[]
  }
}

export function PropertyPDF({ property }: PropertyPDFProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 15
      let yPos = margin

      // Title
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 51, 102)

      const titleLines = pdf.splitTextToSize(property.title, pageWidth - 2 * margin)
      pdf.text(titleLines, margin, yPos)
      yPos += titleLines.length * 8 + 5

      // Price
      pdf.setFontSize(24)
      pdf.setTextColor(0, 102, 204)
      const priceText = formatPrice(property.price) + (property.listingType === 'RENT' ? ' /month' : '')
      pdf.text(priceText, margin, yPos)
      yPos += 10

      // Property Type & Listing Type
      pdf.setFontSize(12)
      pdf.setTextColor(100, 100, 100)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`${property.propertyType} • ${property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}`, margin, yPos)
      yPos += 8

      // Location
      pdf.setFontSize(11)
      pdf.setTextColor(60, 60, 60)
      pdf.text(`${property.address}, ${property.city}${property.state ? `, ${property.state}` : ''}, ${property.country}`, margin, yPos)
      yPos += 15

      // Divider line
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 10

      // Key Features Section
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('Key Features', margin, yPos)
      yPos += 8

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)

      const features: [string, string | undefined][] = [
        ['Bedrooms', property.bedrooms?.toString()],
        ['Bathrooms', property.bathrooms?.toString()],
        ['Total Area', property.area ? `${property.area} m²` : undefined],
        ['Living Area', property.livingArea ? `${property.livingArea} m²` : undefined],
        ['Kitchen Area', property.kitchenArea ? `${property.kitchenArea} m²` : undefined],
        ['Total Rooms', property.rooms?.toString()],
        ['Floor', property.floor && property.totalFloors ? `${property.floor} of ${property.totalFloors}` : property.floor?.toString()],
        ['Year Built', property.yearBuilt?.toString()],
        ['Parking', property.parking ? `${property.parking} spaces` : undefined],
        ['Balcony', property.balcony?.toString()],
        ['Building Type', property.buildingType],
        ['Building Class', property.buildingClass],
        ['Renovation', property.renovation],
        ['Furnished', property.furnished],
        ['Nearest Metro', property.nearestMetro],
        ['Metro Distance', property.metroDistance ? `${property.metroDistance} min walk` : undefined],
      ]

      const validFeatures = features.filter(([_, val]) => val)
      const colWidth = (pageWidth - 2 * margin) / 2

      for (let i = 0; i < validFeatures.length; i += 2) {
        const [label1, value1] = validFeatures[i]
        pdf.setFont('helvetica', 'bold')
        pdf.text(label1 + ':', margin, yPos)
        pdf.setFont('helvetica', 'normal')
        pdf.text(value1!, margin + 35, yPos)

        if (i + 1 < validFeatures.length) {
          const [label2, value2] = validFeatures[i + 1]
          pdf.setFont('helvetica', 'bold')
          pdf.text(label2 + ':', margin + colWidth, yPos)
          pdf.setFont('helvetica', 'normal')
          pdf.text(value2!, margin + colWidth + 35, yPos)
        }
        yPos += 6
      }

      yPos += 10

      // Amenities
      if (property.amenities && property.amenities.length > 0) {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(0, 0, 0)
        pdf.text('Amenities', margin, yPos)
        yPos += 8

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(60, 60, 60)

        const amenityText = property.amenities.map(a => a.replace('_', ' ')).join(' • ')
        const amenityLines = pdf.splitTextToSize(amenityText, pageWidth - 2 * margin)
        pdf.text(amenityLines, margin, yPos)
        yPos += amenityLines.length * 5 + 10
      }

      // Description
      if (yPos < 200) {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(0, 0, 0)
        pdf.text('Description', margin, yPos)
        yPos += 8

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(60, 60, 60)

        const descLines = pdf.splitTextToSize(property.description, pageWidth - 2 * margin)
        const maxLines = Math.min(descLines.length, 15)
        pdf.text(descLines.slice(0, maxLines), margin, yPos)
        if (descLines.length > maxLines) {
          yPos += maxLines * 5
          pdf.text('...', margin, yPos)
        }
      }

      // Footer
      const footerY = pdf.internal.pageSize.getHeight() - 15
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text(`Generated on ${new Date().toLocaleDateString()} • EstateHub`, margin, footerY)
      pdf.text(`Property ID: ${property.id}`, pageWidth - margin - 50, footerY)

      // Save the PDF
      const fileName = `${property.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_property.pdf`
      pdf.save(fileName)

      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generatePDF}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-2" />
      )}
      {isGenerating ? 'Generating...' : 'Download PDF'}
    </Button>
  )
}
