'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Library,
  Loader2,
  X,
  Palette,
  Code2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LibraryGrid } from '@/components/modules/library/LibraryGrid'
import { LibraryListView } from '@/components/modules/library/LibraryListView'
import { LibraryItemForm, type LibraryFormPayload } from '@/components/modules/library/LibraryItemForm'
import { AddToCollectionDialog } from '@/components/modules/library/AddToCollectionDialog'
import { CollectionForm, type CollectionFormPayload } from '@/components/modules/library/CollectionForm'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { ViewToggle, type ViewMode } from '@/components/shared/ViewToggle'
import {
  useLibrary,
  useCreateLibraryItem,
  useDeleteLibraryItem,
  type CreateLibraryItemData,
} from '@/hooks/use-library'
import { useCreateCollection, type CreateCollectionData } from '@/hooks/use-collections'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'library-view-mode'

// Status filter tabs (simplified)
const statusFilters = [
  { id: 'all', label: 'All' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'ARCHIVED', label: 'Archived' },
]

// Type filter buttons (simplified)
const typeFilters = [
  { id: 'DESIGN', label: 'Design', icon: Palette, color: 'text-violet-400', bgColor: 'bg-violet-500/10' },
  { id: 'DEVELOPED', label: 'Developed', icon: Code2, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
]

export default function LibraryPage() {
  const [activeStatus, setActiveStatus] = useState('all')
  const [activeType, setActiveType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'grid' || saved === 'list') {
        return saved
      }
    }
    return 'grid'
  })
  const [addToCollectionItemId, setAddToCollectionItemId] = useState<string | null>(null)
  const [createCollectionOpen, setCreateCollectionOpen] = useState(false)

  function handleViewModeChange(mode: ViewMode) {
    setViewMode(mode)
    localStorage.setItem(STORAGE_KEY, mode)
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filter: Record<string, string> = {}
  if (activeStatus !== 'all') filter.status = activeStatus
  if (activeType) filter.type = activeType
  if (debouncedSearch) filter.search = debouncedSearch

  const { data: items = [], isLoading } = useLibrary(filter)
  const createItem = useCreateLibraryItem()
  const deleteItem = useDeleteLibraryItem()
  const createCollection = useCreateCollection()

  // Count active filters
  const activeFilterCount = [
    activeStatus !== 'all',
    activeType !== null,
    !!debouncedSearch,
  ].filter(Boolean).length

  function clearAllFilters() {
    setActiveStatus('all')
    setActiveType(null)
    setSearchQuery('')
  }

  function handleTypeToggle(typeId: string) {
    setActiveType((prev) => (prev === typeId ? null : typeId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Creative Library</h1>
          <p className="text-sm text-text-secondary">
            Collect and organize your design references and code assets
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Search + View Toggle + Filter Clear */}
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
        <ViewToggle value={viewMode} onChange={handleViewModeChange} />
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-text-secondary">
            <X className="mr-1 h-3 w-3" />
            Clear filters ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto pb-px">
        {statusFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveStatus(f.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg ${
              activeStatus === f.id
                ? 'bg-accent/10 text-accent border-b-2 border-accent -mb-px'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Type Filter Buttons */}
      <div className="flex gap-3">
        {typeFilters.map((f) => {
          const Icon = f.icon
          const isActive = activeType === f.id
          return (
            <button
              key={f.id}
              onClick={() => handleTypeToggle(f.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all border-2',
                isActive
                  ? cn(f.bgColor, f.color, 'border-current')
                  : 'bg-surface-elevated text-text-secondary border-transparent hover:text-text-primary hover:border-border'
              )}
            >
              <Icon className="h-4 w-4" />
              {f.label}
            </button>
          )
        })}
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
                {activeFilterCount > 0
                  ? 'No matching items'
                  : 'Your library is empty'}
              </h3>
              <p className="text-sm text-text-secondary mb-4 max-w-sm">
                {activeFilterCount > 0
                  ? 'Try adjusting your search or filters.'
                  : 'Start collecting design references and code assets.'}
              </p>
              {activeFilterCount > 0 ? (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Item
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {viewMode === 'grid' ? (
            <LibraryGrid
              items={items}
              onDelete={(id) => setDeleteConfirmId(id)}
              onAddToCollection={(id) => setAddToCollectionItemId(id)}
            />
          ) : (
            <LibraryListView items={items} onDelete={(id) => setDeleteConfirmId(id)} />
          )}
        </>
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

      {/* Add to Collection Dialog */}
      <AddToCollectionDialog
        open={!!addToCollectionItemId}
        onOpenChange={(open) => {
          if (!open) setAddToCollectionItemId(null)
        }}
        libraryItemId={addToCollectionItemId || ''}
        onCreateCollection={() => {
          setAddToCollectionItemId(null)
          setCreateCollectionOpen(true)
        }}
      />

      {/* Create Collection Dialog */}
      <CollectionForm
        open={createCollectionOpen}
        onOpenChange={setCreateCollectionOpen}
        onSubmit={(data: CollectionFormPayload) => {
          createCollection.mutate(data as CreateCollectionData, {
            onSuccess: () => {
              toast.success('Collection created')
              setCreateCollectionOpen(false)
            },
            onError: (err) => toast.error(err.message || 'Failed to create collection'),
          })
        }}
      />
    </div>
  )
}
