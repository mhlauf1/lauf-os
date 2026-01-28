'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Plus,
  Search,
  Share2,
  Send,
  Check,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TweetGrid } from '@/components/modules/social/TweetGrid'
import { TweetDraftForm, type TweetDraftFormPayload } from '@/components/modules/social/TweetDraftForm'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import {
  useTweetDrafts,
  useCreateTweetDraft,
  useUpdateTweetDraft,
  useDeleteTweetDraft,
  type CreateTweetDraftData,
  type UpdateTweetDraftData,
} from '@/hooks/use-tweet-drafts'
import type { TweetDraftStatus } from '@prisma/client'

const statusFilters = [
  { id: 'all', label: 'All' },
  { id: 'DRAFT', label: 'Drafts' },
  { id: 'READY', label: 'Ready' },
  { id: 'POSTED', label: 'Posted' },
  { id: 'ARCHIVED', label: 'Archived' },
]

export default function SocialPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filter: Record<string, string> = {}
  if (activeFilter !== 'all') filter.status = activeFilter
  if (debouncedSearch) filter.search = debouncedSearch

  const { data: drafts = [], isLoading } = useTweetDrafts(filter)
  const createDraft = useCreateTweetDraft()
  const updateDraft = useUpdateTweetDraft()
  const deleteDraft = useDeleteTweetDraft()

  const stats = useMemo(() => {
    const total = drafts.length
    const ready = drafts.filter((d) => d.status === 'READY').length
    const posted = drafts.filter((d) => d.status === 'POSTED').length
    return { total, ready, posted }
  }, [drafts])

  function handleStatusChange(id: string, status: TweetDraftStatus) {
    const data: UpdateTweetDraftData = { id, status }
    if (status === 'POSTED') {
      data.postedAt = new Date().toISOString()
    }
    updateDraft.mutate(data, {
      onSuccess: () => toast.success(`Draft marked as ${status.toLowerCase()}`),
      onError: (err) => toast.error(err.message || 'Failed to update draft'),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tweet Drafts</h1>
          <p className="text-sm text-text-secondary">
            Draft, refine, and track your tweets
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Draft
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Total Drafts
            </CardTitle>
            <Share2 className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-text-tertiary">in your queue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Ready to Post
            </CardTitle>
            <Send className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{stats.ready}</div>
            <p className="text-xs text-text-tertiary">finalized drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Posted
            </CardTitle>
            <Check className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.posted}</div>
            <p className="text-xs text-text-tertiary">published tweets</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {statusFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === f.id
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
              <p className="mt-2 text-sm text-text-tertiary">Loading drafts...</p>
            </div>
          </CardContent>
        </Card>
      ) : drafts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tweet Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-surface-elevated p-4 mb-4">
                <Share2 className="h-8 w-8 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {debouncedSearch ? 'No matching drafts' : 'No tweet drafts yet'}
              </h3>
              <p className="text-sm text-text-secondary mb-4 max-w-sm">
                {debouncedSearch
                  ? 'Try adjusting your search query or filter.'
                  : 'Start drafting tweets to build your content queue.'}
              </p>
              {!debouncedSearch && (
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Draft
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <TweetGrid
          drafts={drafts}
          onDelete={(id) => setDeleteConfirmId(id)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Create Dialog */}
      <TweetDraftForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={(data: TweetDraftFormPayload) => {
          createDraft.mutate(data as CreateTweetDraftData, {
            onSuccess: () => {
              toast.success('Draft created')
              setFormOpen(false)
            },
            onError: (err) => toast.error(err.message || 'Failed to create draft'),
          })
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null)
        }}
        title="Delete tweet draft?"
        description="This will permanently delete this draft. This action cannot be undone."
        isPending={deleteDraft.isPending}
        onConfirm={() => {
          if (!deleteConfirmId) return
          deleteDraft.mutate(deleteConfirmId, {
            onSuccess: () => {
              toast.success('Draft deleted')
              setDeleteConfirmId(null)
            },
            onError: (err) => toast.error(err.message || 'Failed to delete draft'),
          })
        }}
      />
    </div>
  )
}
