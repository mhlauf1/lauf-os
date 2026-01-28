'use client'

import { format, isSameDay } from 'date-fns'
import { Plus, Clock, CalendarOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeBlock } from './TimeBlock'
import type { Task } from '@prisma/client'

interface DailyTimelineProps {
  date: Date
  tasks: Task[]
  onAddTask?: () => void
  onEditTask?: (task: Task) => void
  onDeleteTask?: (id: string) => void
  onCompleteTask?: (id: string) => void
}

function formatTimeLabel(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`
}

// Parse a DB date (Prisma @db.Date returns "2026-01-27T00:00:00.000Z")
// as a local calendar date, ignoring the UTC timezone suffix.
function parseCalendarDate(d: string | Date): Date {
  const s = typeof d === 'string' ? d : d.toISOString()
  const [datePart] = s.split('T')
  const [y, m, day] = datePart.split('-').map(Number)
  return new Date(y, m - 1, day)
}

export function DailyTimeline({
  date,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
}: DailyTimelineProps) {
  const isToday = isSameDay(date, new Date())

  // Filter to tasks for this day, then sort by scheduledTime ascending (null at end)
  const dayTasks = tasks
    .filter(
      (task) =>
        task.scheduledDate &&
        isSameDay(parseCalendarDate(task.scheduledDate), date)
    )
    .sort((a, b) => {
      if (!a.scheduledTime && !b.scheduledTime) return 0
      if (!a.scheduledTime) return 1
      if (!b.scheduledTime) return -1
      return a.scheduledTime.localeCompare(b.scheduledTime)
    })

  const completedCount = dayTasks.filter((t) => t.status === 'DONE').length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-text-tertiary" />
            <CardTitle className="text-base">
              {isToday ? "Today's Schedule" : format(date, 'EEEE, MMMM d')}
            </CardTitle>
          </div>
          <span className="text-sm text-text-secondary">
            {completedCount} / {dayTasks.length} completed
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {dayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarOff className="h-8 w-8 text-text-tertiary/50 mb-3" />
            <p className="text-sm text-text-secondary font-medium">
              No tasks scheduled
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              Add a task to start building your day.
            </p>
          </div>
        ) : (
          dayTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-4 cursor-pointer"
              onClick={() => onEditTask?.(task)}
            >
              {/* Time Label */}
              <div className="w-20 pt-3 text-sm text-text-secondary shrink-0">
                {task.scheduledTime
                  ? formatTimeLabel(task.scheduledTime)
                  : 'Anytime'}
              </div>

              {/* Task Block */}
              <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                <TimeBlock
                  task={task}
                  onEdit={(id) => {
                    const t = dayTasks.find((dt) => dt.id === id)
                    if (t) onEditTask?.(t)
                  }}
                  onDelete={onDeleteTask}
                  onComplete={onCompleteTask}
                />
              </div>
            </div>
          ))
        )}

        {/* Add Task button */}
        <button
          onClick={() => onAddTask?.()}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-3 text-sm text-text-tertiary transition-colors hover:border-text-tertiary hover:text-text-secondary mt-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </CardContent>
    </Card>
  )
}
