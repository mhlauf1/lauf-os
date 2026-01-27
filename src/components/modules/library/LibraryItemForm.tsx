'use client'

import { useState } from 'react'
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
import { TagInput } from './TagInput'
import { libraryTypeList } from '@/config/library'
import type { LibraryItem, LibraryItemType } from '@prisma/client'

interface LibraryItemFormData {
  type: LibraryItemType
  title: string
  description: string
  sourceUrl: string
  figmaUrl: string
  githubUrl: string
  prompt: string
  aiTool: string
  techStack: string[]
  tags: string[]
  isShowcased: boolean
  isForSale: boolean
  price: string
}

export interface LibraryFormPayload {
  type: string
  title: string
  description?: string
  sourceUrl?: string
  figmaUrl?: string
  githubUrl?: string
  prompt?: string
  aiTool?: string
  techStack?: string[]
  tags: string[]
  isShowcased: boolean
  isForSale: boolean
  price?: number
}

interface LibraryItemFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LibraryFormPayload) => void
  initialData?: LibraryItem | null
  isEditing?: boolean
}

function getDefaultFormData(initialData?: LibraryItem | null): LibraryItemFormData {
  if (initialData) {
    return {
      type: initialData.type as LibraryItemType,
      title: initialData.title,
      description: initialData.description || '',
      sourceUrl: initialData.sourceUrl || '',
      figmaUrl: initialData.figmaUrl || '',
      githubUrl: initialData.githubUrl || '',
      prompt: initialData.prompt || '',
      aiTool: initialData.aiTool || '',
      techStack: (initialData.techStack as string[]) || [],
      tags: (initialData.tags as string[]) || [],
      isShowcased: initialData.isShowcased,
      isForSale: initialData.isForSale,
      price: initialData.price != null ? String(Number(initialData.price)) : '',
    }
  }

  return {
    type: 'INSPIRATION',
    title: '',
    description: '',
    sourceUrl: '',
    figmaUrl: '',
    githubUrl: '',
    prompt: '',
    aiTool: '',
    techStack: [],
    tags: [],
    isShowcased: false,
    isForSale: false,
    price: '',
  }
}

export function LibraryItemForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: LibraryItemFormProps) {
  const [formData, setFormData] = useState<LibraryItemFormData>(
    getDefaultFormData(initialData)
  )

  // Reset form when dialog opens with different data
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

    const payload: LibraryFormPayload = {
      type: formData.type,
      title: formData.title,
      tags: formData.tags,
      isShowcased: formData.isShowcased,
      isForSale: formData.isForSale,
    }

    if (formData.description) payload.description = formData.description
    if (formData.sourceUrl) payload.sourceUrl = formData.sourceUrl
    if (formData.figmaUrl) payload.figmaUrl = formData.figmaUrl
    if (formData.githubUrl) payload.githubUrl = formData.githubUrl
    if (formData.prompt) payload.prompt = formData.prompt
    if (formData.aiTool) payload.aiTool = formData.aiTool
    if (formData.techStack.length > 0) payload.techStack = formData.techStack
    if (formData.isForSale && formData.price) {
      payload.price = parseFloat(formData.price)
    }

    onSubmit(payload)
  }

  const showSourceUrl = ['INSPIRATION', 'TEMPLATE', 'AI_IMAGE', 'COMPONENT'].includes(formData.type)
  const showFigmaUrl = formData.type === 'TEMPLATE'
  const showGithubUrl = ['TEMPLATE', 'COMPONENT'].includes(formData.type)
  const showPrompt = formData.type === 'AI_IMAGE'
  const showAiTool = formData.type === 'AI_IMAGE'
  const showTechStack = ['TEMPLATE', 'COMPONENT'].includes(formData.type)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Item' : 'Add to Library'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selector */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-5 gap-2">
              {libraryTypeList.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: t.id }))
                  }
                  className={cn(
                    'rounded-lg border p-2 text-xs font-medium transition-colors',
                    formData.type === t.id
                      ? 'border-text-primary/30 bg-white/10 text-text-primary'
                      : 'border-border text-text-secondary hover:border-border/80'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="lib-title">Title *</Label>
            <Input
              id="lib-title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Give it a name..."
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="lib-desc">Description</Label>
            <textarea
              id="lib-desc"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="What is this about?"
              rows={3}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput
              value={formData.tags}
              onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              placeholder="Add tag and press Enter..."
            />
          </div>

          {/* Type-specific fields */}
          {showSourceUrl && (
            <div className="space-y-2">
              <Label htmlFor="lib-source">Source URL</Label>
              <Input
                id="lib-source"
                type="url"
                value={formData.sourceUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sourceUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
          )}

          {showFigmaUrl && (
            <div className="space-y-2">
              <Label htmlFor="lib-figma">Figma URL</Label>
              <Input
                id="lib-figma"
                type="url"
                value={formData.figmaUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, figmaUrl: e.target.value }))
                }
                placeholder="https://figma.com/..."
              />
            </div>
          )}

          {showGithubUrl && (
            <div className="space-y-2">
              <Label htmlFor="lib-github">GitHub URL</Label>
              <Input
                id="lib-github"
                type="url"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
                }
                placeholder="https://github.com/..."
              />
            </div>
          )}

          {showPrompt && (
            <div className="space-y-2">
              <Label htmlFor="lib-prompt">AI Prompt</Label>
              <textarea
                id="lib-prompt"
                value={formData.prompt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, prompt: e.target.value }))
                }
                placeholder="The prompt used to generate this..."
                rows={3}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          {showAiTool && (
            <div className="space-y-2">
              <Label htmlFor="lib-aitool">AI Tool</Label>
              <Input
                id="lib-aitool"
                value={formData.aiTool}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, aiTool: e.target.value }))
                }
                placeholder="e.g., Midjourney, DALL-E, Stable Diffusion"
              />
            </div>
          )}

          {showTechStack && (
            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <TagInput
                value={formData.techStack}
                onChange={(techStack) =>
                  setFormData((prev) => ({ ...prev, techStack }))
                }
                placeholder="Add technology and press Enter..."
              />
            </div>
          )}

          {/* Showcase toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  isShowcased: !prev.isShowcased,
                }))
              }
              className={cn(
                'h-5 w-9 rounded-full transition-colors',
                formData.isShowcased ? 'bg-amber-500' : 'bg-border'
              )}
            >
              <span
                className={cn(
                  'block h-4 w-4 rounded-full bg-white transition-transform',
                  formData.isShowcased ? 'translate-x-4.5' : 'translate-x-0.5'
                )}
              />
            </button>
            <Label className="cursor-pointer">Showcase this item</Label>
          </div>

          {/* For Sale toggle + price */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isForSale: !prev.isForSale,
                    price: !prev.isForSale ? prev.price : '',
                  }))
                }
                className={cn(
                  'h-5 w-9 rounded-full transition-colors',
                  formData.isForSale ? 'bg-green-500' : 'bg-border'
                )}
              >
                <span
                  className={cn(
                    'block h-4 w-4 rounded-full bg-white transition-transform',
                    formData.isForSale ? 'translate-x-4.5' : 'translate-x-0.5'
                  )}
                />
              </button>
              <Label className="cursor-pointer">Available for sale</Label>
            </div>
            {formData.isForSale && (
              <div className="space-y-2 pl-12">
                <Label htmlFor="lib-price">Price ($)</Label>
                <Input
                  id="lib-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0.00"
                  className="max-w-[200px]"
                />
              </div>
            )}
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
              {isEditing ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
