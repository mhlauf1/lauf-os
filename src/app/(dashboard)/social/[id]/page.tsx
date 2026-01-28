'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Trash2,
  Pencil,
  Clock,
  Send,
  Check,
  Archive,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { TweetDraftForm, type TweetDraftFormPayload } from '@/components/modules/social/TweetDraftForm'
import {
  useTweetDraft,
  useUpdateTweetDraft,
  useDeleteTweetDraft,
  type UpdateTweetDraftData,
} from '@/hooks/use-tweet-drafts'
import type { TweetDraftStatus } from '@prisma/client'

const statusConfig: Record<
  TweetDraftStatus,
  { label: string; color: string; bgColor: string; icon: typeof Clock }
> = {
  DRAFT: {
    label: 'Draft',
    color: 'text-text-secondary',
    bgColor: 'bg-white/5',
    icon: Clock,
  },
  READY: {
    label: 'Ready',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: Send,
  },
  POSTED: {
    label: 'Posted',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    icon: Check,
  },
  ARCHIVED: {
    label: 'Archived',
    color: 'text-text-tertiary',
    bgColor: 'bg-white/5',
    icon: Archive,
  },
}

interface TweetDetailPageProps {
  params: Promise<{ id: string }>
}

export default function TweetDetailPage({ params }: TweetDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: draft, isLoading, error } = useTweetDraft(id)
  const updateDraft = useUpdateTweetDraft()
  const deleteDraft = useDeleteTweetDraft()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  function handleDelete() {
    deleteDraft.mutate(id, {
      onSuccess: () => {
        toast.success('Draft deleted')
        router.push('/social')
      },
      onError: (err) => toast.error(err.message || 'Failed to delete draft'),
    })
  }

  function handleStatusChange(status: TweetDraftStatus) {
    const data: UpdateTweetDraftData = { id, status }
    if (status === 'POSTED') {
      data.postedAt = new Date().toISOString()
    }
    updateDraft.mutate(data, {
      onSuccess: () => toast.success(`Draft marked as ${status.toLowerCase()}`),
      onError: (err) => toast.error(err.message || 'Failed to update draft'),
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
        <p className="mt-2 text-sm text-text-tertiary">Loading draft...</p>
      </div>
    )
  }

  if (error || !draft) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/social">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Draft Details</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-text-secondary">
                Draft not found or you don&apos;t have access to this draft.
              </p>
              <Link href="/social" className="mt-4">
                <Button variant="outline">Back to Drafts</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const config = statusConfig[draft.status]
  const StatusIcon = config.icon
  const tags = (draft.tags as string[]) || []
  const charCount = draft.content.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/social">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Tweet Draft</h1>
            <Badge
              variant="secondary"
              className={cn('gap-1', config.bgColor, config.color)}
            >
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-red-400 hover:text-red-500"
            onClick={() => setDeleteOpen(true)}
            disabled={deleteDraft.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Content</CardTitle>
              <span
                className={cn(
                  'text-xs font-mono',
                  charCount > 260 ? 'text-amber-400' : 'text-text-tertiary'
                )}
              >
                {charCount}/280
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-surface-elevated p-4">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {draft.content}
              </p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-text-secondary mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {draft.status !== 'READY' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('READY')}
                  disabled={updateDraft.isPending}
                >
                  <Send className="mr-2 h-4 w-4 text-blue-400" />
                  Mark as Ready
                </Button>
              )}
              {draft.status !== 'POSTED' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('POSTED')}
                  disabled={updateDraft.isPending}
                >
                  <Check className="mr-2 h-4 w-4 text-green-400" />
                  Mark as Posted
                </Button>
              )}
              {draft.status !== 'DRAFT' && draft.status !== 'ARCHIVED' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('DRAFT')}
                  disabled={updateDraft.isPending}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Back to Draft
                </Button>
              )}
              {draft.status !== 'ARCHIVED' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('ARCHIVED')}
                  disabled={updateDraft.isPending}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-text-tertiary">Created</p>
                <p className="text-sm">
                  {new Date(draft.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Last Updated</p>
                <p className="text-sm">
                  {new Date(draft.updatedAt).toLocaleDateString()}
                </p>
              </div>
              {draft.postedAt && (
                <div>
                  <p className="text-xs text-text-tertiary">Posted</p>
                  <p className="text-sm">
                    {new Date(draft.postedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-text-tertiary">Characters</p>
                <p className="text-sm font-mono">{charCount}/280</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <TweetDraftForm
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={draft}
        isEditing
        onSubmit={(data: TweetDraftFormPayload) => {
          updateDraft.mutate(
            { id: draft.id, ...data } as UpdateTweetDraftData,
            {
              onSuccess: () => {
                toast.success('Draft updated')
                setEditOpen(false)
              },
              onError: (err) =>
                toast.error(err.message || 'Failed to update draft'),
            }
          )
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete tweet draft?"
        description="This will permanently delete this draft. This action cannot be undone."
        isPending={deleteDraft.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}
