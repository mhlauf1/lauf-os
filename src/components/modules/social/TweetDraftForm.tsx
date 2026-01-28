'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { TagInput } from '@/components/modules/library/TagInput'
import type { TweetDraft, TweetDraftStatus } from '@prisma/client'

interface TweetDraftFormData {
  content: string
  status: TweetDraftStatus
  tags: string[]
}

export interface TweetDraftFormPayload {
  content: string
  status?: string
  tags: string[]
}

interface TweetDraftFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TweetDraftFormPayload) => void
  initialData?: TweetDraft | null
  isEditing?: boolean
}

const statusOptions: { id: TweetDraftStatus; label: string }[] = [
  { id: 'DRAFT', label: 'Draft' },
  { id: 'READY', label: 'Ready' },
]

function getDefaultFormData(initialData?: TweetDraft | null): TweetDraftFormData {
  if (initialData) {
    return {
      content: initialData.content,
      status: initialData.status,
      tags: (initialData.tags as string[]) || [],
    }
  }
  return {
    content: '',
    status: 'DRAFT',
    tags: [],
  }
}

export function TweetDraftForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: TweetDraftFormProps) {
  const [formData, setFormData] = useState<TweetDraftFormData>(
    getDefaultFormData(initialData)
  )

  const [lastId, setLastId] = useState(initialData?.id ?? '')
  const currentId = initialData?.id ?? ''
  if (currentId !== lastId) {
    setLastId(currentId)
    if (open) {
      setFormData(getDefaultFormData(initialData))
    }
  }

  const charCount = formData.content.length
  const isOverLimit = charCount > 280

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isOverLimit) return

    const payload: TweetDraftFormPayload = {
      content: formData.content,
      status: formData.status,
      tags: formData.tags,
    }

    onSubmit(payload)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Tweet Draft' : 'New Tweet Draft'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tweet-content">Content *</Label>
              <span
                className={cn(
                  'text-xs font-mono',
                  isOverLimit
                    ? 'text-red-400'
                    : charCount > 260
                      ? 'text-amber-400'
                      : 'text-text-tertiary'
                )}
              >
                {charCount}/280
              </span>
            </div>
            <textarea
              id="tweet-content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="What's on your mind?"
              rows={6}
              required
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: opt.id }))
                  }
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                    formData.status === opt.id
                      ? 'border-text-primary/30 bg-white/10 text-text-primary'
                      : 'border-border text-text-secondary hover:border-border/80'
                  )}
                >
                  {opt.label}
                </button>
              ))}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isOverLimit || !formData.content.trim()}>
              {isEditing ? 'Save Changes' : 'Create Draft'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
