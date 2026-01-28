'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Upload, X, Link as LinkIcon, Loader2, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState(value || '')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploadError(null)
      setIsUploading(true)

      // Show local preview immediately
      const localPreview = URL.createObjectURL(file)
      setPreviewUrl(localPreview)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload/library', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok || result.error) {
          throw new Error(result.error || 'Upload failed')
        }

        // Update with actual URL
        onChange(result.data.url)
        setPreviewUrl(null)
        URL.revokeObjectURL(localPreview)
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Upload failed')
        setPreviewUrl(null)
        URL.revokeObjectURL(localPreview)
      } finally {
        setIsUploading(false)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: isUploading,
  })

  function handleUrlSubmit() {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
    }
  }

  function handleRemove() {
    onChange('')
    setUrlInput('')
    setPreviewUrl(null)
    setUploadError(null)
  }

  const displayUrl = previewUrl || value

  return (
    <div className={cn('space-y-2', className)}>
      <Label>Thumbnail</Label>

      {displayUrl ? (
        <div className="relative rounded-lg border border-border overflow-hidden">
          <div className="relative h-40 w-full">
            <Image
              src={displayUrl}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
          {!isUploading && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'url')}>
          <TabsList className="w-full">
            <TabsTrigger value="upload" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="flex-1">
              <LinkIcon className="mr-2 h-4 w-4" />
              URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-3">
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                isDragActive
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-text-tertiary',
                isUploading && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
                  <p className="text-sm text-text-secondary">Uploading...</p>
                </div>
              ) : isDragActive ? (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-accent" />
                  <p className="text-sm text-accent">Drop image here</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-8 w-8 text-text-tertiary" />
                  <p className="text-sm text-text-secondary">
                    Drag & drop an image, or click to select
                  </p>
                  <p className="text-xs text-text-tertiary">
                    PNG, JPG, WebP, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
            {uploadError && (
              <p className="mt-2 text-xs text-red-400">{uploadError}</p>
            )}
          </TabsContent>

          <TabsContent value="url" className="mt-3 space-y-3">
            <Input
              type="url"
              placeholder="https://example.com/image.png"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              Use URL
            </Button>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
