'use client'

import Link from 'next/link'
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
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCollectionColorConfig } from '@/config/collection'
import type { CollectionWithCount } from '@/hooks/use-collections'

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

interface CollectionCardProps {
  collection: CollectionWithCount
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function CollectionCard({ collection, onEdit, onDelete }: CollectionCardProps) {
  const colorConfig = getCollectionColorConfig(collection.color)
  const IconComponent = iconMap[collection.icon || 'Folder'] || Folder

  return (
    <Link href={`/library/collections/${collection.id}`}>
      <div className="group rounded-lg border border-border bg-surface transition-all hover:border-border/80 hover:bg-surface-elevated p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                'h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0',
                colorConfig.bgColor
              )}
            >
              <IconComponent className={cn('h-5 w-5', colorConfig.textColor)} />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium truncate">{collection.name}</h3>
              <p className="text-xs text-text-secondary">
                {collection._count.items} {collection._count.items === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  onEdit?.(collection.id)
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400"
                onClick={(e) => {
                  e.preventDefault()
                  onDelete?.(collection.id)
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {collection.description && (
          <p className="mt-2 text-sm text-text-secondary line-clamp-2">
            {collection.description}
          </p>
        )}
      </div>
    </Link>
  )
}
