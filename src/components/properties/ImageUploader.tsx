"use client"

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { X, Upload, Loader2, Star, MoveVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useUploadThing } from '@/lib/uploadthing'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface ImageFile {
  url: string
  name: string
  isPrimary?: boolean
}

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const t = useTranslations('properties.form.imageUploader')
  const [uploading, setUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const { startUpload, isUploading } = useUploadThing("propertyImages", {
    onClientUploadComplete: (files) => {
      const newUrls = files.map(file => file.url)
      onChange([...images, ...newUrls])
      toast.success(t('uploadSuccess', { count: files.length }))
      setUploading(false)
    },
    onUploadError: (error) => {
      toast.error(`Upload failed: ${error.message}`)
      setUploading(false)
    },
  })

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(t('maxImagesError', { max: maxImages }))
      return
    }

    setUploading(true)
    await startUpload(acceptedFiles)
  }, [images, maxImages, startUpload, t])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: maxImages - images.length,
    disabled: uploading || isUploading || images.length >= maxImages,
  })

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
    toast.success(t('imageRemoved'))
  }

  const setPrimaryImage = (index: number) => {
    if (index === 0) return // Already primary
    const newImages = [...images]
    const primaryImage = newImages.splice(index, 1)[0]
    newImages.unshift(primaryImage)
    onChange(newImages)
    toast.success(t('primaryUpdated'))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)

    onChange(newImages)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
            ${(uploading || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {uploading || isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                <p className="text-sm text-gray-600">{t('uploading')}</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isDragActive ? t('dropHere') : t('dragOrClick')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('fileTypes')} ({images.length}/{maxImages})
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <Card
              key={index}
              className="relative group overflow-hidden cursor-move"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="aspect-square relative">
                <Image
                  src={url}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Set as Primary */}
                  {index !== 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setPrimaryImage(index)}
                      className="h-8 w-8 p-0"
                      title={t('setPrimary')}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Delete */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                    className="h-8 w-8 p-0"
                    title={t('removeImage')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {t('primary')}
                  </div>
                )}

                {/* Drag Handle */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 p-1 rounded">
                    <MoveVertical className="h-4 w-4 text-gray-600" />
                  </div>
                </div>

                {/* Image Number */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {index + 1}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {images.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          {t('helperText')}
        </p>
      )}
    </div>
  )
}
