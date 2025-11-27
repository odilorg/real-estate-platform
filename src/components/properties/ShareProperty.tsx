"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Share2, Facebook, Twitter, Linkedin, Link, Mail, Check } from 'lucide-react'
import { toast } from 'sonner'

interface SharePropertyProps {
  propertyId: string
  propertyTitle: string
  propertyPrice: number
  propertyCity: string
}

export function ShareProperty({
  propertyId,
  propertyTitle,
  propertyPrice,
  propertyCity,
}: SharePropertyProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/properties/${propertyId}`
    : ''

  const shareText = `Check out this property: ${propertyTitle} in ${propertyCity} for $${propertyPrice.toLocaleString()}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = (platform: string) => {
    let url = ''

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(`Property: ${propertyTitle}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
        window.location.href = url
        return
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="h-4 w-4 mr-2 text-sky-500" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('email')}>
          <Mail className="h-4 w-4 mr-2 text-gray-600" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-green-600" />
          ) : (
            <Link className="h-4 w-4 mr-2 text-gray-600" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
