'use client'

import Link from 'next/link'
import { MoreHorizontal, Check, Clock, Send, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { TweetDraft, TweetDraftStatus } from '@prisma/client'

const statusConfig: Record<
  TweetDraftStatus,
  { label: string; color: string; bgColor: string; icon: typeof Clock }
> = {
  DRAFT: {
    label: 'Draft',
    color: 'text-text-secondary',
    bgColor: 'bg-white/5',
    icon: Clock,
  },
  READY: {
    label: 'Ready',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: Send,
  },
  POSTED: {
    label: 'Posted',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    icon: Check,
  },
  ARCHIVED: {
    label: 'Archived',
    color: 'text-text-tertiary',
    bgColor: 'bg-white/5',
    icon: Archive,
  },
}

interface TweetDraftCardProps {
  draft: TweetDraft
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, status: TweetDraftStatus) => void
}

export function TweetDraftCard({ draft, onDelete, onStatusChange }: TweetDraftCardProps) {
  const config = statusConfig[draft.status]
  const StatusIcon = config.icon
  const tags = (draft.tags as string[]) || []
  const charCount = draft.content.length

  return (
    <Link href={`/social/${draft.id}`}>
      <div className="group rounded-lg border border-border bg-surface transition-all hover:border-border/80 hover:bg-surface-elevated p-4">
        {/* Status + Actions Row */}
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant="secondary"
            className={cn('text-xs gap-1', config.bgColor, config.color)}
          >
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>

          <div className="flex items-center gap-2">
            <span className={cn(
              'text-xs font-mono',
              charCount > 260 ? 'text-amber-400' : 'text-text-tertiary'
            )}>
              {charCount}/280
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {draft.status !== 'READY' && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      onStatusChange?.(draft.id, 'READY')
                    }}
                  >
                    Mark as Ready
                  </DropdownMenuItem>
                )}
                {draft.status !== 'POSTED' && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      onStatusChange?.(draft.id, 'POSTED')
                    }}
                  >
                    Mark as Posted
                  </DropdownMenuItem>
                )}
                {draft.status !== 'ARCHIVED' && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      onStatusChange?.(draft.id, 'ARCHIVED')
                    }}
                  >
                    Archive
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-red-400"
                  onClick={(e) => {
                    e.preventDefault()
                    onDelete?.(draft.id)
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm whitespace-pre-wrap line-clamp-6">
          {draft.content}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs text-text-secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-text-tertiary">
          <span>
            {new Date(draft.createdAt).toLocaleDateString()}
          </span>
          {draft.tweetNumber > 0 && draft.totalTweets > 1 && (
            <span>
              {draft.tweetNumber}/{draft.totalTweets} in thread
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
