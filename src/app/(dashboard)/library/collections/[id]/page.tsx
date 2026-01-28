'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Loader2,
  FolderOpen,
  Folder,
  FolderOpenIcon,
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
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LibraryGrid } from '@/components/modules/library/LibraryGrid'
import { CollectionForm, type CollectionFormPayload } from '@/components/modules/library/CollectionForm'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import {
  useCollection,
  useUpdateCollection,
  useDeleteCollection,
  useRemoveCollectionItem,
  type UpdateCollectionData,
} from '@/hooks/use-collections'
import { getCollectionColorConfig } from '@/config/collection'

const iconMap: Record<string, LucideIcon> = {
  Folder,
  FolderOpen: FolderOpenIcon,
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

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: collection, isLoading, error } = useCollection(id)
  const updateCollection = useUpdateCollection()
  const deleteCollection = useDeleteCollection()
  const removeItem = useRemoveCollectionItem()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className="space-y-4">
        <Link href="/library/collections">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Button>
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-text-tertiary mb-4" />
            <h2 className="text-lg font-medium mb-2">Collection not found</h2>
            <p className="text-sm text-text-secondary">
              This collection may have been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Capture collection ID for use in callbacks (TypeScript narrowing)
  const collectionId = collection.id
  const colorConfig = getCollectionColorConfig(collection.color)
  const IconComponent = iconMap[collection.icon || 'Folder'] || Folder
  const libraryItems = collection.items.map((item) => item.libraryItem)

  function handleUpdate(data: CollectionFormPayload) {
    updateCollection.mutate(
      { id: collectionId, ...data } as UpdateCollectionData,
      {
        onSuccess: () => {
          toast.success('Collection updated')
          setEditOpen(false)
        },
        onError: (err) => toast.error(err.message || 'Failed to update collection'),
      }
    )
  }

  function handleDelete() {
    deleteCollection.mutate(collectionId, {
      onSuccess: () => {
        toast.success('Collection deleted')
        router.push('/library/collections')
      },
      onError: (err) => toast.error(err.message || 'Failed to delete collection'),
    })
  }

  function handleRemoveItem(libraryItemId: string) {
    removeItem.mutate(
      { collectionId, libraryItemId },
      {
        onSuccess: () => toast.success('Item removed from collection'),
        onError: (err) => toast.error(err.message || 'Failed to remove item'),
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/library/collections">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collections
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0',
              colorConfig.bgColor
            )}
          >
            <IconComponent className={cn('h-7 w-7', colorConfig.textColor)} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{collection.name}</h1>
            {collection.description && (
              <p className="text-sm text-text-secondary mt-1">
                {collection.description}
              </p>
            )}
            <p className="text-xs text-text-tertiary mt-1">
              {collection._count.items} {collection._count.items === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-400 hover:text-red-400"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Items Grid */}
      {libraryItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="rounded-full bg-surface-elevated p-4 mx-auto mb-4 w-fit">
              <FolderOpen className="h-8 w-8 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-medium mb-2">This collection is empty</h3>
            <p className="text-sm text-text-secondary mb-4 max-w-sm mx-auto">
              Add items from your library to this collection.
            </p>
            <Link href="/library">
              <Button variant="outline">Go to Library</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <LibraryGrid items={libraryItems} onDelete={handleRemoveItem} />
      )}

      {/* Edit Dialog */}
      <CollectionForm
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        initialData={collection}
        isEditing
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete collection?"
        description="This will permanently delete this collection. Items in the collection will not be deleted."
        isPending={deleteCollection.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}
