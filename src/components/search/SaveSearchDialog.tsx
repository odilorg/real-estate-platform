"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { BookmarkPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { AdvancedFilterValues } from './AdvancedFilters'

interface SaveSearchDialogProps {
  filters: {
    query?: string
    propertyType?: string
    listingType?: string
    sortBy?: string
  }
  advancedFilters: AdvancedFilterValues
}

export function SaveSearchDialog({ filters, advancedFilters }: SaveSearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name for your search')
      return
    }

    setSaving(true)
    try {
      // Combine basic and advanced filters
      const combinedFilters = {
        query: filters.query,
        propertyTypes: advancedFilters.propertyTypes.length > 0
          ? advancedFilters.propertyTypes
          : filters.propertyType && filters.propertyType !== 'all'
            ? [filters.propertyType]
            : [],
        listingTypes: advancedFilters.listingTypes.length > 0
          ? advancedFilters.listingTypes
          : filters.listingType && filters.listingType !== 'all'
            ? [filters.listingType]
            : [],
        minPrice: advancedFilters.minPrice,
        maxPrice: advancedFilters.maxPrice,
        minBedrooms: advancedFilters.minBedrooms,
        maxBedrooms: advancedFilters.maxBedrooms,
        minBathrooms: advancedFilters.minBathrooms,
        maxBathrooms: advancedFilters.maxBathrooms,
        minArea: advancedFilters.minArea,
        maxArea: advancedFilters.maxArea,
        amenities: advancedFilters.amenities,
        city: advancedFilters.city,
        state: advancedFilters.state,
      }

      const res = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          filters: combinedFilters,
          notificationsEnabled,
        }),
      })

      if (res.ok) {
        toast.success('Search saved successfully!')
        setOpen(false)
        setName('')
        setNotificationsEnabled(false)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save search')
      }
    } catch (error) {
      console.error('Error saving search:', error)
      toast.error('Failed to save search')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Save Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save This Search</DialogTitle>
          <DialogDescription>
            Save your current search filters to quickly access them later and get notified when new properties match your criteria.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="search-name">Search Name</Label>
            <Input
              id="search-name"
              placeholder="e.g., 3BR Apartments in Downtown"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">
                Get notified when new properties match this search
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save Search
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
