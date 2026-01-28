'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MoreHorizontal, Copy, Check, ExternalLink, Code2 } from 'lucide-react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getLibraryTypeConfig, getLibraryStatusConfig, getCodeLanguageConfig } from '@/config/library'
import type { LibraryItem, LibraryItemType, LibraryItemStatus } from '@prisma/client'

interface LibraryListViewProps {
  items: LibraryItem[]
  onDelete?: (id: string) => void
}

function ListRow({ item, onDelete }: { item: LibraryItem; onDelete?: (id: string) => void }) {
  const [copied, setCopied] = useState(false)
  const typeConfig = getLibraryTypeConfig(item.type as LibraryItemType)
  const statusConfig = getLibraryStatusConfig((item.status as LibraryItemStatus) || 'ACTIVE')
  const languageConfig = item.language ? getCodeLanguageConfig(item.language) : null
  const tags = (item.tags as string[]) || []
  const visibleTags = tags.slice(0, 2)
  const extraTagCount = tags.length - 2
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
    <TableRow className="group cursor-pointer hover:bg-surface-elevated">
      <TableCell className="w-16 p-2">
        <Link href={`/library/${item.id}`} className="block">
          <div
            className="h-10 w-10 rounded-md relative overflow-hidden flex-shrink-0"
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
                sizes="40px"
              />
            )}
          </div>
        </Link>
      </TableCell>
      <TableCell className="min-w-0">
        <Link href={`/library/${item.id}`} className="block">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{item.title}</span>
            {item.sourceUrl && (
              <ExternalLink className="h-3 w-3 text-text-tertiary flex-shrink-0" />
            )}
          </div>
          {item.description && (
            <p className="text-xs text-text-secondary truncate max-w-md">
              {item.description}
            </p>
          )}
        </Link>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge
          variant="secondary"
          className={cn('text-xs font-medium', typeConfig.bgColor, typeConfig.textColor)}
        >
          {typeConfig.label}
        </Badge>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <Badge
          variant="secondary"
          className={cn('text-xs font-medium', statusConfig.bgColor, statusConfig.textColor)}
        >
          {statusConfig.label}
        </Badge>
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs text-text-secondary">
                {tag}
              </Badge>
            ))}
            {extraTagCount > 0 && (
              <Badge variant="outline" className="text-xs text-text-tertiary">
                +{extraTagCount}
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-text-tertiary text-xs">-</span>
        )}
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center gap-1.5">
          {hasCode && (
            <>
              <button
                onClick={handleCopyCode}
                className="rounded-full bg-blue-500/20 p-1 hover:bg-blue-500/30 transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-400" />
                ) : (
                  <Copy className="h-3 w-3 text-blue-400" />
                )}
              </button>
              {languageConfig && (
                <Badge variant="secondary" className="text-[10px] bg-blue-500/10 text-blue-400 font-mono">
                  {languageConfig.extension || languageConfig.id}
                </Badge>
              )}
            </>
          )}
          {!hasCode && <span className="text-text-tertiary text-xs">-</span>}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell text-xs text-text-secondary">
        {new Date(item.updatedAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="w-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.preventDefault()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/library/${item.id}`}>View Details</Link>
            </DropdownMenuItem>
            {hasCode && (
              <DropdownMenuItem onClick={handleCopyCode}>
                <Code2 className="mr-2 h-4 w-4" />
                Copy Code
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
      </TableCell>
    </TableRow>
  )
}

export function LibraryListView({ items, onDelete }: LibraryListViewProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Status</TableHead>
              <TableHead className="hidden xl:table-cell">Tags</TableHead>
              <TableHead className="hidden sm:table-cell">Code</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <ListRow key={item.id} item={item} onDelete={onDelete} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
