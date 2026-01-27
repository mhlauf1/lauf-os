'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Plus,
  Search,
  Library,
  Star,
  Lightbulb,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LibraryGrid } from '@/components/modules/library/LibraryGrid'
import { LibraryItemForm, type LibraryFormPayload } from '@/components/modules/library/LibraryItemForm'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import {
  useLibrary,
  useCreateLibraryItem,
  useDeleteLibraryItem,
  type CreateLibraryItemData,
} from '@/hooks/use-library'
import { libraryTypeList } from '@/config/library'

const typeFilters = [
  { id: 'all', label: 'All' },
  ...libraryTypeList.map((t) => ({ id: t.id, label: t.pluralLabel })),
]

export default function LibraryPage() {
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
  if (activeFilter !== 'all') filter.type = activeFilter
  if (debouncedSearch) filter.search = debouncedSearch

  const { data: items = [], isLoading } = useLibrary(filter)
  const createItem = useCreateLibraryItem()
  const deleteItem = useDeleteLibraryItem()

  const stats = useMemo(() => {
    const total = items.length
    const showcased = items.filter((i) => i.isShowcased).length
    const ideas = items.filter((i) => i.type === 'IDEA').length
    return { total, showcased, ideas }
  }, [items])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Creative Library</h1>
          <p className="text-sm text-text-secondary">
            Collect and organize creative assets
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Total Items
            </CardTitle>
            <Library className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-text-tertiary">in your library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Showcased
            </CardTitle>
            <Star className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{stats.showcased}</div>
            <p className="text-xs text-text-tertiary">featured items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Ideas
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.ideas}</div>
            <p className="text-xs text-text-tertiary">to explore</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {typeFilters.map((f) => (
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
              <p className="mt-2 text-sm text-text-tertiary">Loading library...</p>
            </div>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Creative Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-surface-elevated p-4 mb-4">
                <Library className="h-8 w-8 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {debouncedSearch ? 'No matching items' : 'Your library is empty'}
              </h3>
              <p className="text-sm text-text-secondary mb-4 max-w-sm">
                {debouncedSearch
                  ? 'Try adjusting your search query or filter.'
                  : 'Start collecting inspirations, templates, components, and ideas.'}
              </p>
              {!debouncedSearch && (
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Item
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <LibraryGrid items={items} onDelete={(id) => setDeleteConfirmId(id)} />
      )}

      {/* Create Dialog */}
      <LibraryItemForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={(data: LibraryFormPayload) => {
          createItem.mutate(data as CreateLibraryItemData, {
            onSuccess: () => {
              toast.success('Item added to library')
              setFormOpen(false)
            },
            onError: (err) => toast.error(err.message || 'Failed to create item'),
          })
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null)
        }}
        title="Delete library item?"
        description="This will permanently delete this item. This action cannot be undone."
        isPending={deleteItem.isPending}
        onConfirm={() => {
          if (!deleteConfirmId) return
          deleteItem.mutate(deleteConfirmId, {
            onSuccess: () => {
              toast.success('Item deleted')
              setDeleteConfirmId(null)
            },
            onError: (err) => toast.error(err.message || 'Failed to delete item'),
          })
        }}
      />
    </div>
  )
}
