'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Trash2,
  Pencil,
  ExternalLink,
  Star,
  DollarSign,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { LibraryItemForm, type LibraryFormPayload } from '@/components/modules/library/LibraryItemForm'
import {
  useLibraryItem,
  useUpdateLibraryItem,
  useDeleteLibraryItem,
  type UpdateLibraryItemData,
} from '@/hooks/use-library'
import { getLibraryTypeConfig } from '@/config/library'
import type { LibraryItemType } from '@prisma/client'

interface LibraryDetailPageProps {
  params: Promise<{ id: string }>
}

export default function LibraryDetailPage({ params }: LibraryDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: item, isLoading, error } = useLibraryItem(id)
  const updateItem = useUpdateLibraryItem()
  const deleteItem = useDeleteLibraryItem()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  function handleDelete() {
    deleteItem.mutate(id, {
      onSuccess: () => {
        toast.success('Item deleted')
        router.push('/library')
      },
      onError: (err) => toast.error(err.message || 'Failed to delete item'),
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
        <p className="mt-2 text-sm text-text-tertiary">Loading item...</p>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/library">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Item Details</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-text-secondary">
                Item not found or you don&apos;t have access to this item.
              </p>
              <Link href="/library" className="mt-4">
                <Button variant="outline">Back to Library</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const typeConfig = getLibraryTypeConfig(item.type as LibraryItemType)
  const tags = (item.tags as string[]) || []
  const techStack = (item.techStack as string[]) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/library">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{item.title}</h1>
            <Badge
              variant="secondary"
              className={cn(typeConfig.bgColor, typeConfig.textColor)}
            >
              {typeConfig.label}
            </Badge>
            {item.isShowcased && (
              <div className="rounded-full bg-amber-500/10 p-1.5">
                <Star className="h-3.5 w-3.5 text-amber-400" />
              </div>
            )}
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
            disabled={deleteItem.isPending}
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
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            {item.description && (
              <div>
                <p className="text-sm text-text-secondary mb-1">Description</p>
                <p className="text-sm whitespace-pre-wrap">{item.description}</p>
              </div>
            )}

            {/* AI Prompt */}
            {item.prompt && (
              <div>
                <p className="text-sm text-text-secondary mb-1">AI Prompt</p>
                <div className="rounded-lg border border-border bg-surface-elevated p-3">
                  <p className="text-sm font-mono whitespace-pre-wrap">
                    {item.prompt}
                  </p>
                </div>
              </div>
            )}

            {/* AI Tool */}
            {item.aiTool && (
              <div>
                <p className="text-sm text-text-secondary mb-1">AI Tool</p>
                <p className="text-sm font-medium">{item.aiTool}</p>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div>
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

            {/* Tech Stack */}
            {techStack.length > 0 && (
              <div>
                <p className="text-sm text-text-secondary mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="text-xs bg-blue-500/10 text-blue-400"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* External Links */}
          {(item.sourceUrl || item.figmaUrl || item.githubUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Source
                  </a>
                )}
                {item.figmaUrl && (
                  <a
                    href={item.figmaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Figma
                  </a>
                )}
                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    GitHub
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sale Info */}
          {item.isForSale && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  For Sale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-400">
                  {item.price != null ? `$${Number(item.price).toFixed(2)}` : 'Price TBD'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-text-tertiary">Created</p>
                <p className="text-sm">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Last Updated</p>
                <p className="text-sm">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <LibraryItemForm
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={item}
        isEditing
        onSubmit={(data: LibraryFormPayload) => {
          updateItem.mutate(
            { id: item.id, ...data } as UpdateLibraryItemData,
            {
              onSuccess: () => {
                toast.success('Item updated')
                setEditOpen(false)
              },
              onError: (err) =>
                toast.error(err.message || 'Failed to update item'),
            }
          )
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete library item?"
        description="This will permanently delete this item. This action cannot be undone."
        isPending={deleteItem.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}
