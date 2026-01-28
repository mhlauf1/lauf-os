'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, FolderOpen, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CollectionCard } from '@/components/modules/library/CollectionCard'
import { CollectionForm, type CollectionFormPayload } from '@/components/modules/library/CollectionForm'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
  type CollectionWithCount,
  type CreateCollectionData,
  type UpdateCollectionData,
} from '@/hooks/use-collections'

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<CollectionWithCount | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filter = debouncedSearch ? { search: debouncedSearch } : {}
  const { data: collections = [], isLoading } = useCollections(filter)
  const createCollection = useCreateCollection()
  const updateCollection = useUpdateCollection()
  const deleteCollection = useDeleteCollection()

  function handleCreate(data: CollectionFormPayload) {
    createCollection.mutate(data as CreateCollectionData, {
      onSuccess: () => {
        toast.success('Collection created')
        setFormOpen(false)
      },
      onError: (err) => toast.error(err.message || 'Failed to create collection'),
    })
  }

  function handleUpdate(data: CollectionFormPayload) {
    if (!editingCollection) return
    updateCollection.mutate(
      { id: editingCollection.id, ...data } as UpdateCollectionData,
      {
        onSuccess: () => {
          toast.success('Collection updated')
          setEditingCollection(null)
        },
        onError: (err) => toast.error(err.message || 'Failed to update collection'),
      }
    )
  }

  function handleDelete() {
    if (!deleteConfirmId) return
    deleteCollection.mutate(deleteConfirmId, {
      onSuccess: () => {
        toast.success('Collection deleted')
        setDeleteConfirmId(null)
      },
      onError: (err) => toast.error(err.message || 'Failed to delete collection'),
    })
  }

  const totalItems = collections.reduce((sum, c) => sum + c._count.items, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Collections</h1>
          <p className="text-sm text-text-secondary">
            Organize your library items into groups
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 max-w-md">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Collections
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collections.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Total Items
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
              <p className="mt-2 text-sm text-text-tertiary">Loading collections...</p>
            </div>
          </CardContent>
        </Card>
      ) : collections.length === 0 ? (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-surface-elevated p-4 mb-4">
                <FolderOpen className="h-8 w-8 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No matching collections' : 'No collections yet'}
              </h3>
              <p className="text-sm text-text-secondary mb-4 max-w-sm">
                {searchQuery
                  ? 'Try adjusting your search.'
                  : 'Create collections to organize your library items.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Collection
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-text-secondary">
            {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={(id) => {
                  const found = collections.find((c) => c.id === id)
                  if (found) setEditingCollection(found)
                }}
                onDelete={(id) => setDeleteConfirmId(id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Create Dialog */}
      <CollectionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />

      {/* Edit Dialog */}
      <CollectionForm
        open={!!editingCollection}
        onOpenChange={(open) => {
          if (!open) setEditingCollection(null)
        }}
        onSubmit={handleUpdate}
        initialData={editingCollection}
        isEditing
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null)
        }}
        title="Delete collection?"
        description="This will permanently delete this collection. Items in the collection will not be deleted."
        isPending={deleteCollection.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}
