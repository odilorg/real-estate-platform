"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AdminDeletePropertyButtonProps {
  propertyId: string
  propertyTitle: string
}

export function AdminDeletePropertyButton({
  propertyId,
  propertyTitle,
}: AdminDeletePropertyButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Property deleted successfully')
        setOpen(false)
        router.refresh()
      } else {
        throw new Error('Failed to delete property')
      }
    } catch (error) {
      toast.error('Failed to delete property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Property</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{propertyTitle}&quot;? This action cannot be undone.
            All associated images, reviews, and favorites will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Property'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
