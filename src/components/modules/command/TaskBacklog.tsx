'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { getCategoryConfig } from '@/config/categories'
import type { Task } from '@prisma/client'

interface TaskBacklogContentProps {
  tasks: Task[]
}

export function TaskBacklogContent({ tasks }: TaskBacklogContentProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-text-tertiary">
          No unscheduled tasks. Create tasks from the Tasks page, then drag them here.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-text-tertiary mb-3">
        Drag a task to a time slot to schedule it
      </p>
      <div className="space-y-2">
        {tasks.map((task) => (
          <DraggableTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

function DraggableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { type: 'task', task },
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskBacklogCardInner task={task} isDragging={isDragging} />
    </div>
  )
}

export function TaskBacklogCardInner({
  task,
  isDragging = false,
}: {
  task: Task
  isDragging?: boolean
}) {
  const categoryConfig = getCategoryConfig(task.category)

  return (
    <div
      className={cn(
        'w-full rounded-lg border border-border p-3 text-left transition-all cursor-grab active:cursor-grabbing',
        'hover:border-border/80 hover:bg-surface-elevated',
        'border-l-4',
        isDragging && 'opacity-50 ring-2 ring-accent'
      )}
      style={{ borderLeftColor: categoryConfig.color }}
    >
      <p className="font-medium text-sm">{task.title}</p>
      <div className="flex flex-wrap items-center gap-1.5 mt-1">
        <Badge
          variant="secondary"
          className={cn('text-[10px] px-1.5 py-0', categoryConfig.textColor)}
        >
          {categoryConfig.label}
        </Badge>
        <span className="flex items-center gap-0.5 text-[10px] text-text-tertiary">
          <Clock className="h-3 w-3" />
          {task.timeBlockMinutes}m
        </span>
      </div>
    </div>
  )
}
