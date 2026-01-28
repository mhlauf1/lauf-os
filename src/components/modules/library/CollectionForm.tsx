'use client'

import { useState } from 'react'
import {
  Folder,
  FolderOpen,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Archive,
  Box,
  Package,
  Layers,
  Grid,
  Layout,
  Palette,
  Paintbrush,
  Wand2,
  Sparkles,
  Lightbulb,
  Zap,
  Rocket,
  Code2,
  Component,
  FileCode,
  Image as ImageIcon,
  Video,
  Music,
  Globe,
  Building,
  Users,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { collectionColors, collectionIcons } from '@/config/collection'
import type { Collection } from '@prisma/client'

const iconMap: Record<string, LucideIcon> = {
  Folder,
  FolderOpen,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Archive,
  Box,
  Package,
  Layers,
  Grid,
  Layout,
  Palette,
  Paintbrush,
  Wand2,
  Sparkles,
  Lightbulb,
  Zap,
  Rocket,
  Code2,
  Component,
  FileCode,
  Image: ImageIcon,
  Video,
  Music,
  Globe,
  Building,
  Users,
  Trophy,
}

interface CollectionFormData {
  name: string
  description: string
  color: string
  icon: string
}

export interface CollectionFormPayload {
  name: string
  description?: string
  color?: string
  icon?: string
}

interface CollectionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CollectionFormPayload) => void
  initialData?: Collection | null
  isEditing?: boolean
}

function getDefaultFormData(initialData?: Collection | null): CollectionFormData {
  if (initialData) {
    return {
      name: initialData.name,
      description: initialData.description || '',
      color: initialData.color || collectionColors[0].color,
      icon: initialData.icon || 'Folder',
    }
  }

  return {
    name: '',
    description: '',
    color: collectionColors[0].color,
    icon: 'Folder',
  }
}

export function CollectionForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: CollectionFormProps) {
  const [formData, setFormData] = useState<CollectionFormData>(
    getDefaultFormData(initialData)
  )

  // Reset form when dialog opens with different data (same pattern as LibraryItemForm)
  const [lastId, setLastId] = useState(initialData?.id ?? '')
  const currentId = initialData?.id ?? ''
  if (currentId !== lastId) {
    setLastId(currentId)
    if (open) {
      setFormData(getDefaultFormData(initialData))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload: CollectionFormPayload = {
      name: formData.name,
    }

    if (formData.description) payload.description = formData.description
    if (formData.color) payload.color = formData.color
    if (formData.icon) payload.icon = formData.icon

    onSubmit(payload)
  }

  const selectedColorConfig = collectionColors.find((c) => c.color === formData.color) || collectionColors[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Collection' : 'Create Collection'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="collection-name">Name *</Label>
            <Input
              id="collection-name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="My Collection"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="collection-desc">Description</Label>
            <textarea
              id="collection-desc"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="What's this collection for?"
              rows={2}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-10 gap-1 p-2 border border-border rounded-lg max-h-32 overflow-y-auto">
              {collectionIcons.map((iconConfig) => {
                const IconComponent = iconMap[iconConfig.id] || Folder
                return (
                  <button
                    key={iconConfig.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, icon: iconConfig.id }))
                    }
                    className={cn(
                      'p-1.5 rounded transition-colors',
                      formData.icon === iconConfig.id
                        ? cn(selectedColorConfig.bgColor, selectedColorConfig.textColor)
                        : 'text-text-secondary hover:bg-surface-elevated'
                    )}
                    title={iconConfig.label}
                  >
                    <IconComponent className="h-4 w-4" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {collectionColors.map((colorConfig) => (
                <button
                  key={colorConfig.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, color: colorConfig.color }))
                  }
                  className={cn(
                    'h-6 w-6 rounded-full transition-all',
                    formData.color === colorConfig.color && 'ring-2 ring-offset-2 ring-offset-background'
                  )}
                  style={{
                    backgroundColor: colorConfig.color,
                    // @ts-expect-error - CSS custom property for Tailwind ring color
                    '--tw-ring-color': colorConfig.color,
                  }}
                  title={colorConfig.label}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Create Collection'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
