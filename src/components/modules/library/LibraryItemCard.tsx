'use client'

import Link from 'next/link'
import { MoreHorizontal, Star, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getLibraryTypeConfig } from '@/config/library'
import type { LibraryItem, LibraryItemType } from '@prisma/client'

interface LibraryItemCardProps {
  item: LibraryItem
  onDelete?: (id: string) => void
}

export function LibraryItemCard({ item, onDelete }: LibraryItemCardProps) {
  const typeConfig = getLibraryTypeConfig(item.type as LibraryItemType)
  const tags = (item.tags as string[]) || []
  const visibleTags = tags.slice(0, 3)
  const extraTagCount = tags.length - 3

  return (
    <Link href={`/library/${item.id}`}>
      <div className="group rounded-lg border border-border bg-surface transition-all hover:border-border/80 hover:bg-surface-elevated overflow-hidden">
        {/* Gradient Thumbnail */}
        <div
          className="h-32 w-full"
          style={{
            background: `linear-gradient(135deg, ${typeConfig.color}20 0%, ${typeConfig.color}08 100%)`,
          }}
        >
          <div className="flex h-full items-start justify-between p-3">
            <Badge
              variant="secondary"
              className={cn('text-xs', typeConfig.bgColor, typeConfig.textColor)}
            >
              {typeConfig.label}
            </Badge>
            <div className="flex items-center gap-1">
              {item.isShowcased && (
                <div className="rounded-full bg-amber-500/10 p-1">
                  <Star className="h-3 w-3 text-amber-400" />
                </div>
              )}
              {item.isForSale && (
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400">
                  <DollarSign className="h-3 w-3 mr-0.5" />
                  {item.price != null ? Number(item.price) : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium truncate">{item.title}</h3>
              {item.description && (
                <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                  {item.description}
                </p>
              )}
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
                  className="text-red-400"
                  onClick={(e) => {
                    e.preventDefault()
                    onDelete?.(item.id)
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {visibleTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-text-secondary">
                  {tag}
                </Badge>
              ))}
              {extraTagCount > 0 && (
                <Badge variant="outline" className="text-xs text-text-tertiary">
                  +{extraTagCount} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
