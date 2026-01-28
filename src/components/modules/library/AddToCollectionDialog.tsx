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
  Plus,
  Check,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getCollectionColorConfig } from '@/config/collection'
import {
  useCollections,
  useAddCollectionItem,
  useRemoveCollectionItem,
  type CollectionWithCount,
} from '@/hooks/use-collections'

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

interface AddToCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  libraryItemId: string
  currentCollectionIds?: string[]
  onCreateCollection?: () => void
}

export function AddToCollectionDialog({
  open,
  onOpenChange,
  libraryItemId,
  currentCollectionIds = [],
  onCreateCollection,
}: AddToCollectionDialogProps) {
  const { data: collections = [], isLoading } = useCollections()
  const addItem = useAddCollectionItem()
  const removeItem = useRemoveCollectionItem()
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())

  async function handleToggle(collection: CollectionWithCount) {
    const isInCollection = currentCollectionIds.includes(collection.id)
    setPendingIds((prev) => new Set([...prev, collection.id]))

    try {
      if (isInCollection) {
        await removeItem.mutateAsync({
          collectionId: collection.id,
          libraryItemId,
        })
      } else {
        await addItem.mutateAsync({
          collectionId: collection.id,
          libraryItemId,
        })
      }
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(collection.id)
        return next
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-64 overflow-y-auto -mx-1 px-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-text-secondary mb-4">
                No collections yet
              </p>
              {onCreateCollection && (
                <Button variant="outline" size="sm" onClick={onCreateCollection}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Collection
                </Button>
              )}
            </div>
          ) : (
            collections.map((collection) => {
              const isInCollection = currentCollectionIds.includes(collection.id)
              const isPending = pendingIds.has(collection.id)
              const colorConfig = getCollectionColorConfig(collection.color)
              const IconComponent = iconMap[collection.icon || 'Folder'] || Folder

              return (
                <button
                  key={collection.id}
                  onClick={() => handleToggle(collection)}
                  disabled={isPending}
                  className={cn(
                    'w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left',
                    isInCollection
                      ? 'bg-accent/10 border border-accent/30'
                      : 'hover:bg-surface-elevated border border-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0',
                      colorConfig.bgColor
                    )}
                  >
                    <IconComponent className={cn('h-4 w-4', colorConfig.textColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{collection.name}</p>
                    <p className="text-xs text-text-tertiary">
                      {collection._count.items} items
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin text-text-tertiary" />
                    ) : isInCollection ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <Plus className="h-4 w-4 text-text-tertiary" />
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {collections.length > 0 && onCreateCollection && (
          <div className="pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-text-secondary"
              onClick={onCreateCollection}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Collection
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
