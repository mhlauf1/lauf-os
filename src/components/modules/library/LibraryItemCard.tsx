'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MoreHorizontal, Copy, Check, Code2, ExternalLink, FolderPlus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { getLibraryTypeConfig, getLibraryStatusConfig, getCodeLanguageConfig } from '@/config/library'
import type { LibraryItem, LibraryItemType, LibraryItemStatus } from '@prisma/client'

interface LibraryItemCardProps {
  item: LibraryItem
  onDelete?: (id: string) => void
  onAddToCollection?: (id: string) => void
}

export function LibraryItemCard({ item, onDelete, onAddToCollection }: LibraryItemCardProps) {
  const [copied, setCopied] = useState(false)
  const typeConfig = getLibraryTypeConfig(item.type as LibraryItemType)
  const statusConfig = getLibraryStatusConfig((item.status as LibraryItemStatus) || 'ACTIVE')
  const languageConfig = item.language ? getCodeLanguageConfig(item.language) : null
  const tags = (item.tags as string[]) || []
  const visibleTags = tags.slice(0, 3)
  const extraTagCount = tags.length - 3
  const hasCode = !!item.code
  const hasThumbnail = !!item.thumbnailUrl

  function handleCopyCode(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!item.code) return
    navigator.clipboard.writeText(item.code)
    setCopied(true)
    toast.success('Code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={`/library/${item.id}`}>
          <div className="group rounded-lg border border-border bg-surface transition-all hover:border-border/80 hover:bg-surface-elevated overflow-hidden">
            {/* Thumbnail or Gradient */}
            <div
              className="h-32 w-full relative"
              style={
                !hasThumbnail
                  ? {
                      background: `linear-gradient(135deg, ${typeConfig.color}20 0%, ${typeConfig.color}08 100%)`,
                    }
                  : undefined
              }
            >
              {hasThumbnail && (
                <Image
                  src={item.thumbnailUrl!}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 flex items-start justify-between p-3">
                <div className="flex flex-col gap-1.5">
                  <Badge
                    variant="secondary"
                    className={cn('text-xs font-medium', typeConfig.bgColor, typeConfig.textColor)}
                  >
                    {typeConfig.label}
                  </Badge>
                  {/* Status Badge */}
                  <Badge
                    variant="secondary"
                    className={cn('text-xs font-medium', statusConfig.bgColor, statusConfig.textColor)}
                  >
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {hasCode && (
                    <>
                      {/* Quick Copy Button */}
                      <button
                        onClick={handleCopyCode}
                        className="rounded-full bg-blue-500/20 p-1.5 hover:bg-blue-500/30 transition-colors"
                        title="Copy code"
                      >
                        {copied ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-blue-400" />
                        )}
                      </button>
                      {/* Language Badge */}
                      {languageConfig && (
                        <Badge variant="secondary" className="text-[10px] bg-blue-500/10 text-blue-400 font-mono">
                          {languageConfig.extension || languageConfig.id}
                        </Badge>
                      )}
                    </>
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
                    {onAddToCollection && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault()
                          onAddToCollection(item.id)
                        }}
                      >
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Add to Collection
                      </DropdownMenuItem>
                    )}
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
      </HoverCardTrigger>

      {/* Hover Preview */}
      <HoverCardContent
        className="w-80 p-0 overflow-hidden"
        side="right"
        align="start"
        sideOffset={8}
      >
        {/* Large Preview Image */}
        <div
          className="h-48 w-full relative"
          style={
            !hasThumbnail
              ? {
                  background: `linear-gradient(135deg, ${typeConfig.color}30 0%, ${typeConfig.color}10 100%)`,
                }
              : undefined
          }
        >
          {hasThumbnail && (
            <Image
              src={item.thumbnailUrl!}
              alt={item.title}
              fill
              className="object-cover"
              sizes="320px"
            />
          )}
          {!hasThumbnail && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn('text-4xl font-bold opacity-20', typeConfig.textColor)}>
                {typeConfig.label.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Preview Content */}
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold text-sm">{item.title}</h4>
            {item.description && (
              <p className="text-xs text-text-secondary mt-1 line-clamp-3">
                {item.description}
              </p>
            )}
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="secondary"
              className={cn('text-xs', typeConfig.bgColor, typeConfig.textColor)}
            >
              {typeConfig.label}
            </Badge>
            <Badge
              variant="secondary"
              className={cn('text-xs', statusConfig.bgColor, statusConfig.textColor)}
            >
              {statusConfig.label}
            </Badge>
            {hasCode && languageConfig && (
              <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-400">
                <Code2 className="h-3 w-3 mr-1" />
                {languageConfig.label}
              </Badge>
            )}
          </div>

          {/* Links */}
          {(item.sourceUrl || item.figmaUrl || item.githubUrl) && (
            <div className="flex gap-2 pt-1">
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  Source
                </a>
              )}
              {item.figmaUrl && (
                <a
                  href={item.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  Figma
                </a>
              )}
              {item.githubUrl && (
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  GitHub
                </a>
              )}
            </div>
          )}

          {/* Tags (full list) */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] text-text-tertiary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
