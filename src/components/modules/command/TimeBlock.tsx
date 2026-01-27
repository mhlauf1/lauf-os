'use client'

import { useState } from 'react'
import { Clock, GripVertical, MoreHorizontal, Play, Pause, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCategoryConfig } from '@/config/categories'
import type { Task, TaskCategory, TaskStatus } from '@prisma/client'

interface TimeBlockProps {
  task: Pick<Task, 'id' | 'title' | 'category' | 'status' | 'timeBlockMinutes' | 'scheduledTime'>
  onEdit?: (id: string) => void
  onComplete?: (id: string) => void
  onStart?: (id: string) => void
  onPause?: (id: string) => void
  isDragging?: boolean
}

export function TimeBlock({
  task,
  onEdit,
  onComplete,
  onStart,
  onPause,
  isDragging,
}: TimeBlockProps) {
  const categoryConfig = getCategoryConfig(task.category)
  const isInProgress = task.status === 'IN_PROGRESS'
  const isCompleted = task.status === 'DONE'

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-lg border p-3 transition-all',
        'bg-surface hover:bg-surface-elevated',
        isCompleted && 'opacity-60',
        isDragging && 'shadow-lg ring-2 ring-accent',
        `border-l-4`,
      )}
      style={{ borderLeftColor: categoryConfig.color }}
    >
      {/* Drag Handle */}
      <div className="cursor-grab text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Category Icon */}
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg',
          categoryConfig.bgColor
        )}
      >
        <Clock className={cn('h-4 w-4', categoryConfig.textColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'font-medium truncate',
              isCompleted && 'line-through text-text-tertiary'
            )}
          >
            {task.title}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className={cn('text-xs', categoryConfig.textColor)}>
            {categoryConfig.label}
          </Badge>
          <span className="text-xs text-text-tertiary">
            {task.timeBlockMinutes} min
          </span>
          {task.scheduledTime && (
            <span className="text-xs text-text-tertiary">
              @ {task.scheduledTime}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isCompleted && (
          <>
            {isInProgress ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPause?.(task.id)}
              >
                <Pause className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onStart?.(task.id)}
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-400 hover:text-green-500"
              onClick={() => onComplete?.(task.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(task.id)}>
              Edit task
            </DropdownMenuItem>
            <DropdownMenuItem>Reschedule</DropdownMenuItem>
            <DropdownMenuItem className="text-red-400">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
