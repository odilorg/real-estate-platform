"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  propertyId: string
  variant?: 'default' | 'icon'
  className?: string
}

export function FavoriteButton({ propertyId, variant = 'icon', className }: FavoriteButtonProps) {
  const { data: session, status } = useSession()
  const isSignedIn = status === 'authenticated'
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (isSignedIn) {
      checkFavoriteStatus()
    } else {
      setChecking(false)
    }
  }, [isSignedIn, propertyId])

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const favorites = await response.json()
        const found = favorites.some((f: { id: string }) => f.id === propertyId)
        setIsFavorite(found)
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    } finally {
      setChecking(false)
    }
  }

  const toggleFavorite = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to save favorites')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/favorites', {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      })

      if (response.ok) {
        setIsFavorite(!isFavorite)
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
      } else {
        throw new Error('Failed to update favorite')
      }
    } catch (error) {
      toast.error('Failed to update favorite')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <Button variant="outline" size="icon" disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={toggleFavorite}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart
            className={cn(
              'h-4 w-4',
              isFavorite && 'fill-red-500 text-red-500'
            )}
          />
        )}
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={toggleFavorite}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Heart
          className={cn(
            'h-4 w-4 mr-2',
            isFavorite && 'fill-red-500 text-red-500'
          )}
        />
      )}
      {isFavorite ? 'Saved' : 'Save'}
    </Button>
  )
}
