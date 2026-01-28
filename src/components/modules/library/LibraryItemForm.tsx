'use client'

import { useState } from 'react'
import { Palette, Code2 } from 'lucide-react'
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
import { ImageUpload } from './ImageUpload'
import { codeLanguageList } from '@/config/library'
import type { LibraryItem, LibraryItemType, LibraryItemStatus, Goal } from '@prisma/client'

interface LibraryItemFormData {
  type: LibraryItemType
  status: LibraryItemStatus
  title: string
  description: string
  sourceUrl: string
  figmaUrl: string
  githubUrl: string
  techStack: string[]
  tags: string[]
  code: string
  language: string
  thumbnailUrl: string
  goalId: string
}

export interface LibraryFormPayload {
  type: string
  status?: string
  title: string
  description?: string
  sourceUrl?: string
  figmaUrl?: string
  githubUrl?: string
  techStack?: string[]
  tags: string[]
  code?: string
  language?: string
  thumbnailUrl?: string
  goalId?: string
}

interface LibraryItemFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LibraryFormPayload) => void
  initialData?: LibraryItem | null
  isEditing?: boolean
  goals?: Goal[]
}

function getDefaultFormData(initialData?: LibraryItem | null): LibraryItemFormData {
  if (initialData) {
    return {
      type: initialData.type as LibraryItemType,
      status: (initialData.status as LibraryItemStatus) || 'ACTIVE',
      title: initialData.title,
      description: initialData.description || '',
      sourceUrl: initialData.sourceUrl || '',
      figmaUrl: initialData.figmaUrl || '',
      githubUrl: initialData.githubUrl || '',
      techStack: (initialData.techStack as string[]) || [],
      tags: (initialData.tags as string[]) || [],
      code: initialData.code || '',
      language: initialData.language || '',
      thumbnailUrl: initialData.thumbnailUrl || '',
      goalId: initialData.goalId || '',
    }
  }

  return {
    type: 'DESIGN',
    status: 'ACTIVE',
    title: '',
    description: '',
    sourceUrl: '',
    figmaUrl: '',
    githubUrl: '',
    techStack: [],
    tags: [],
    code: '',
    language: '',
    thumbnailUrl: '',
    goalId: '',
  }
}

const typeOptions = [
  {
    id: 'DESIGN' as const,
    label: 'Design',
    description: 'Screenshots, videos, Figma files, visual references',
    icon: Palette,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  {
    id: 'DEVELOPED' as const,
    label: 'Developed',
    description: 'Components, sections, pages, templates - built code',
    icon: Code2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
]

const statusOptions = [
  { id: 'ACTIVE' as const, label: 'Active', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  { id: 'ARCHIVED' as const, label: 'Archived', color: 'text-gray-400', bgColor: 'bg-gray-500/10' },
]

export function LibraryItemForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
  goals = [],
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
      status: formData.status,
      tags: formData.tags,
      title: formData.title,
    }

    if (formData.description) payload.description = formData.description
    if (formData.sourceUrl) payload.sourceUrl = formData.sourceUrl
    if (formData.figmaUrl) payload.figmaUrl = formData.figmaUrl
    if (formData.githubUrl) payload.githubUrl = formData.githubUrl
    if (formData.techStack.length > 0) payload.techStack = formData.techStack
    if (formData.code) payload.code = formData.code
    if (formData.language) payload.language = formData.language
    if (formData.thumbnailUrl) payload.thumbnailUrl = formData.thumbnailUrl
    if (formData.goalId) payload.goalId = formData.goalId

    onSubmit(payload)
  }

  const isDeveloped = formData.type === 'DEVELOPED'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Item' : 'Add to Library'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selector - Large buttons */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {typeOptions.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: t.id }))
                    }
                    className={cn(
                      'flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all',
                      formData.type === t.id
                        ? cn('border-current', t.bgColor, t.color)
                        : 'border-border text-text-secondary hover:border-text-tertiary hover:text-text-primary'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{t.label}</span>
                    </div>
                    <p className="text-xs opacity-70">{t.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status Selector */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: s.id }))
                  }
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-all border-2',
                    formData.status === s.id
                      ? cn(s.bgColor, s.color, 'border-current')
                      : 'bg-surface-elevated text-text-secondary border-transparent hover:text-text-primary hover:border-border'
                  )}
                >
                  {s.label}
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

          {/* Thumbnail Upload */}
          <ImageUpload
            value={formData.thumbnailUrl}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, thumbnailUrl: url }))
            }
          />

          {/* URLs */}
          <div className="space-y-4">
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

          {/* Tech Stack */}
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

          {/* Code Fields - shown for DEVELOPED type */}
          {isDeveloped && (
            <div className="space-y-4 rounded-lg border border-border bg-surface-elevated p-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">Code</span>
              </div>

              {/* Language Selector */}
              <div className="space-y-2">
                <Label htmlFor="lib-language">Language</Label>
                <select
                  id="lib-language"
                  value={formData.language}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, language: e.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select language...</option>
                  {codeLanguageList.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Code Textarea */}
              <div className="space-y-2">
                <Label htmlFor="lib-code">Code</Label>
                <textarea
                  id="lib-code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code: e.target.value }))
                  }
                  placeholder="Paste your code here..."
                  rows={8}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          )}

          {/* Goal Link */}
          {goals.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="lib-goalId">Link to Goal (optional)</Label>
              <select
                id="lib-goalId"
                value={formData.goalId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, goalId: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">No goal</option>
                {(['MONTHLY', 'WEEKLY', 'DAILY', 'YEARLY'] as const).map((type) => {
                  const typeGoals = goals.filter((g) => g.type === type)
                  if (typeGoals.length === 0) return null
                  return (
                    <optgroup key={type} label={type.charAt(0) + type.slice(1).toLowerCase()}>
                      {typeGoals.map((goal) => (
                        <option key={goal.id} value={goal.id}>
                          {goal.title}
                          {goal.targetValue
                            ? ` (${goal.currentValue}/${goal.targetValue})`
                            : ''}
                        </option>
                      ))}
                    </optgroup>
                  )
                })}
              </select>
              {formData.goalId && (
                <p className="text-[10px] text-text-tertiary">
                  Creating this item will count toward goal progress.
                </p>
              )}
            </div>
          )}

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
