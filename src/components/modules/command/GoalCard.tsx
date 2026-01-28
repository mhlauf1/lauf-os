'use client'

import { Plus, Minus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GoalProgressBar } from './GoalProgressBar'
import type { GoalWithCounts } from '@/hooks/use-goals'
import type { GoalBreakdown } from '@/lib/utils/goal-cascades'

interface GoalCardProps {
  goal: GoalWithCounts
  breakdown?: GoalBreakdown
  onIncrement?: (id: string, value: number) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const typeLabels: Record<string, string> = {
  DAILY: 'D',
  WEEKLY: 'W',
  MONTHLY: 'M',
  YEARLY: 'Y',
}

const typeBgColors: Record<string, string> = {
  DAILY: 'bg-blue-500/10 text-blue-400',
  WEEKLY: 'bg-violet-500/10 text-violet-400',
  MONTHLY: 'bg-amber-500/10 text-amber-400',
  YEARLY: 'bg-green-500/10 text-green-400',
}

export function GoalCard({ goal, breakdown, onIncrement, onEdit, onDelete }: GoalCardProps) {
  const isCompleted = !!goal.completedAt
  const hasTarget = goal.targetValue !== null && goal.targetValue > 0

  return (
    <div
      className={cn(
        'rounded-lg border border-border p-4 transition-colors hover:bg-surface-elevated',
        isCompleted && 'opacity-60'
      )}
    >
      {/* Header: title + type badge + menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* On-track indicator dot */}
          {hasTarget && breakdown && (
            <span
              className={cn(
                'h-2 w-2 rounded-full shrink-0',
                isCompleted
                  ? 'bg-green-400'
                  : breakdown.isOnTrack
                    ? 'bg-green-400'
                    : 'bg-amber-400'
              )}
            />
          )}
          <h3
            className={cn(
              'text-sm font-medium truncate',
              isCompleted && 'line-through text-text-tertiary'
            )}
          >
            {goal.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', typeBgColors[goal.type])}>
            {typeLabels[goal.type]}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded p-1 text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(goal.id)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(goal.id)}
                className="text-red-400 focus:text-red-400"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Progress bar */}
      {hasTarget && (
        <div className="mt-3">
          <GoalProgressBar
            current={goal.currentValue}
            target={goal.targetValue!}
            expectedByNow={breakdown?.expectedByNow}
            isOnTrack={breakdown?.isOnTrack}
          />
        </div>
      )}

      {/* Breakdown chips for monthly/weekly goals */}
      {hasTarget && breakdown && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {breakdown.expectedPerWeek !== null && goal.type !== 'DAILY' && (
            <span className="text-[10px] text-text-tertiary bg-surface-elevated rounded px-1.5 py-0.5">
              ~{breakdown.expectedPerWeek}/wk
            </span>
          )}
          {breakdown.expectedPerDay !== null && goal.type !== 'DAILY' && (
            <span className="text-[10px] text-text-tertiary bg-surface-elevated rounded px-1.5 py-0.5">
              ~{breakdown.expectedPerDay}/day
            </span>
          )}
        </div>
      )}

      {/* Bottom row: linked counts + increment buttons */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-text-tertiary">
          {goal._count && goal._count.tasks > 0 && (
            <span>{goal._count.tasks} task{goal._count.tasks !== 1 ? 's' : ''}</span>
          )}
          {goal._count && goal._count.libraryItems > 0 && (
            <span>{goal._count.libraryItems} item{goal._count.libraryItems !== 1 ? 's' : ''}</span>
          )}
        </div>

        {hasTarget && !isCompleted && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onIncrement?.(goal.id, -1)}
              disabled={goal.currentValue <= 0}
              className="rounded p-1 text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onIncrement?.(goal.id, 1)}
              className="rounded p-1 text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
