'use client'

import { Clock, GripVertical, MoreHorizontal, Zap, Brain, Coffee } from 'lucide-react'
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
import type { Task, EnergyLevel, Priority } from '@prisma/client'

interface TaskCardProps {
  task: Pick<
    Task,
    | 'id'
    | 'title'
    | 'description'
    | 'category'
    | 'status'
    | 'priority'
    | 'timeBlockMinutes'
    | 'energyLevel'
  >
  onEdit?: (id: string) => void
  onSchedule?: (id: string) => void
  onDelete?: (id: string) => void
  isDraggable?: boolean
}

const energyIcons: Record<EnergyLevel, typeof Zap> = {
  DEEP_WORK: Zap,
  MODERATE: Brain,
  LIGHT: Coffee,
}

const priorityColors: Record<Priority, string> = {
  LOW: 'text-gray-400',
  MEDIUM: 'text-blue-400',
  HIGH: 'text-orange-400',
  URGENT: 'text-red-400',
}

export function TaskCard({
  task,
  onEdit,
  onSchedule,
  onDelete,
  isDraggable = true,
}: TaskCardProps) {
  const categoryConfig = getCategoryConfig(task.category)
  const EnergyIcon = energyIcons[task.energyLevel]

  return (
    <div
      className={cn(
        'group rounded-lg border border-border bg-surface p-3 transition-all',
        'hover:border-border/80 hover:bg-surface-elevated',
        isDraggable && 'cursor-grab active:cursor-grabbing'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        {isDraggable && (
          <div className="mt-1 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium truncate">{task.title}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(task.id)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSchedule?.(task.id)}>
                  Schedule
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400"
                  onClick={() => onDelete?.(task.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-text-secondary line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className={cn('text-xs', categoryConfig.textColor)}
              style={{ backgroundColor: `${categoryConfig.color}15` }}
            >
              {categoryConfig.label}
            </Badge>

            <div className="flex items-center gap-1 text-text-tertiary">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{task.timeBlockMinutes}m</span>
            </div>

            <div className={cn('flex items-center gap-1', priorityColors[task.priority])}>
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              <span className="text-xs">{task.priority}</span>
            </div>

            <div className="flex items-center gap-1 text-text-tertiary">
              <EnergyIcon className="h-3 w-3" />
              <span className="text-xs capitalize">
                {task.energyLevel.replace('_', ' ').toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
