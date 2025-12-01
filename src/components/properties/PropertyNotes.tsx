'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface PropertyNotesProps {
  propertyId: string
  propertyTitle?: string
  variant?: 'icon' | 'button'
}

export function PropertyNotes({ propertyId, propertyTitle, variant = 'icon' }: PropertyNotesProps) {
  const { data: session } = useSession()
  const t = useTranslations('property')
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasNote, setHasNote] = useState(false)

  // Fetch existing note when dialog opens
  useEffect(() => {
    if (open && session?.user) {
      fetchNote()
    }
  }, [open, session])

  const fetchNote = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/notes?propertyId=${propertyId}`)
      const data = await res.json()
      if (data.note) {
        setContent(data.note.content)
        setOriginalContent(data.note.content)
        setHasNote(true)
      } else {
        setContent('')
        setOriginalContent('')
        setHasNote(false)
      }
    } catch (error) {
      console.error('Error fetching note:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, content }),
      })

      if (res.ok) {
        toast.success(t('noteSaved') || 'Note saved')
        setOriginalContent(content)
        setHasNote(content.length > 0)
        setOpen(false)
      } else {
        toast.error(t('noteError') || 'Failed to save note')
      }
    } catch (error) {
      console.error('Error saving note:', error)
      toast.error(t('noteError') || 'Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/notes?propertyId=${propertyId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success(t('noteDeleted') || 'Note deleted')
        setContent('')
        setOriginalContent('')
        setHasNote(false)
        setOpen(false)
      } else {
        toast.error(t('noteError') || 'Failed to delete note')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error(t('noteError') || 'Failed to delete note')
    } finally {
      setSaving(false)
    }
  }

  if (!session?.user) {
    return null
  }

  const hasChanges = content !== originalContent

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'icon' ? (
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 ${hasNote ? 'text-blue-600 hover:text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            title={t('notes') || 'Notes'}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" className="gap-2">
            <Edit3 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('notes') || 'Notes'}</span>
            {hasNote && <span className="h-2 w-2 rounded-full bg-blue-500" />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('personalNotes') || 'Personal Notes'}</DialogTitle>
          <DialogDescription>
            {propertyTitle
              ? `${t('notesFor') || 'Notes for'}: ${propertyTitle}`
              : t('notesDescription') || 'Add your personal notes about this property. Only you can see these notes.'
            }
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="py-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('notesPlaceholder') || 'Write your notes here... (e.g., questions to ask, pros/cons, follow-up items)'}
              className="min-h-[150px] resize-none"
            />
            <p className="mt-2 text-xs text-gray-500">
              {t('notesPrivate') || 'These notes are private and only visible to you.'}
            </p>
          </div>
        )}

        <DialogFooter className="flex gap-2 sm:gap-0">
          {hasNote && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
              className="mr-auto"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="ml-2">{t('delete') || 'Delete'}</span>
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            {t('cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={saving || !hasChanges}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
