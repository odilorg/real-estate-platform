"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'

interface FavoritesContextType {
  favorites: Set<string>
  isLoading: boolean
  toggleFavorite: (propertyId: string) => Promise<void>
  isFavorite: (propertyId: string) => boolean
  refreshFavorites: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user's favorites on mount
  useEffect(() => {
    if (isLoaded && user) {
      fetchFavorites()
    } else if (isLoaded && !user) {
      // Not logged in - use local storage
      const storedFavorites = localStorage.getItem('favorites')
      if (storedFavorites) {
        setFavorites(new Set(JSON.parse(storedFavorites)))
      }
      setIsLoading(false)
    }
  }, [isLoaded, user])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const properties = await response.json()
        const favoriteIds = new Set<string>(properties.map((p: { id: string }) => p.id))
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshFavorites = async () => {
    if (user) {
      await fetchFavorites()
    }
  }

  const toggleFavorite = async (propertyId: string) => {
    const isFav = favorites.has(propertyId)

    // Optimistic update
    const newFavorites = new Set(favorites)
    if (isFav) {
      newFavorites.delete(propertyId)
    } else {
      newFavorites.add(propertyId)
    }
    setFavorites(newFavorites)

    // If not logged in, just save to localStorage
    if (!user) {
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)))
      return
    }

    // API call
    try {
      if (isFav) {
        // Remove from favorites
        const response = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId }),
        })

        if (!response.ok) {
          throw new Error('Failed to remove favorite')
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId }),
        })

        if (!response.ok) {
          throw new Error('Failed to add favorite')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Revert on error
      setFavorites(favorites)
    }
  }

  const isFavorite = (propertyId: string) => {
    return favorites.has(propertyId)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        toggleFavorite,
        isFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
