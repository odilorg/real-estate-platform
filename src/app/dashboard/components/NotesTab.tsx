"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Trash2, Loader2, MapPin, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface PropertyNote {
  id: string
  propertyId: string
  content: string
  updatedAt: string
  property: {
    id: string
    title: string
    price: number
    city: string
    address: string
    images: string[]
    listingType: string
  }
}

export function NotesTab() {
  const t = useTranslations('dashboard')
  const tProperty = useTranslations('property')
  const [notes, setNotes] = useState<PropertyNote[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes/all')
      const data = await res.json()
      if (data.notes) {
        setNotes(data.notes)
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (note: PropertyNote) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const handleSave = async (propertyId: string) => {
    setSaving(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, content: editContent }),
      })

      if (res.ok) {
        toast.success(tProperty('noteSaved'))
        setEditingId(null)
        fetchNotes()
      } else {
        toast.error(tProperty('noteError'))
      }
    } catch (error) {
      toast.error(tProperty('noteError'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (propertyId: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/notes?propertyId=${propertyId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success(tProperty('noteDeleted'))
        setNotes(notes.filter(n => n.propertyId !== propertyId))
      } else {
        toast.error(tProperty('noteError'))
      }
    } catch (error) {
      toast.error(tProperty('noteError'))
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Edit3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('noNotes') || 'No notes yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {t('noNotesDesc') || 'Add notes to properties you are interested in to keep track of your thoughts.'}
          </p>
          <Link href="/properties">
            <Button>{t('browseProperties') || 'Browse Properties'}</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            {t('myNotes') || 'My Notes'} ({notes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex gap-4">
                {/* Property Image */}
                <Link href={`/properties/${note.property.id}`} className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={note.property.images[0] || '/placeholder-property.jpg'}
                      alt={note.property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Property Info */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Link
                        href={`/properties/${note.property.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                      >
                        {note.property.title}
                      </Link>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {note.property.city}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(note.property.price)}
                        {note.property.listingType === 'RENT' && (
                          <span className="text-sm font-normal text-gray-500">/{tProperty('perMonth')}</span>
                        )}
                      </p>
                    </div>
                    <Link href={`/properties/${note.property.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Note Content */}
                  {editingId === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(note.propertyId)}
                          disabled={saving}
                        >
                          {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                          {tProperty('save')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          disabled={saving}
                        >
                          {tProperty('cancel')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-400">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(note)}
                            className="h-7 px-2"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            {tProperty('notes')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(note.propertyId)}
                            className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
