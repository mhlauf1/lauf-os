'use client'

import { useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { Plus, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeBlock } from './TimeBlock'
import type { Task } from '@prisma/client'

interface DailyTimelineProps {
  date: Date
  tasks: Task[]
  onAddTask?: (time: string) => void
  onEditTask?: (id: string) => void
  onDeleteTask?: (id: string) => void
  onCompleteTask?: (id: string) => void
  onStartTask?: (id: string) => void
  onPauseTask?: (id: string) => void
  slots?: string[]
}

// Default day schedule: 6:30 AM – 10:30 PM
const DEFAULT_SLOTS = [
  '06:30', '07:30', '09:00', '10:30',
  '12:00', '13:30', '15:00', '16:30',
  '18:00', '19:30', '21:00',
]

function formatTimeLabel(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`
}

export function DailyTimeline({
  date,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
  onStartTask,
  onPauseTask,
  slots = DEFAULT_SLOTS,
}: DailyTimelineProps) {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)

  const timeSlots = slots.map((time) => ({
    time,
    label: formatTimeLabel(time),
  }))

  // Get task for a specific time slot
  const getTaskForSlot = (time: string) => {
    return tasks.find(
      (task) =>
        task.scheduledTime === time &&
        task.scheduledDate &&
        isSameDay(new Date(task.scheduledDate), date)
    )
  }

  const isToday = isSameDay(date, new Date())

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
            {tasks.filter((t) => t.status === 'DONE').length} / {tasks.length}{' '}
            completed
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {timeSlots.map((slot) => {
          const task = getTaskForSlot(slot.time)
          const isHovered = hoveredSlot === slot.time

          return (
            <div
              key={slot.time}
              className="flex items-start gap-4"
              onMouseEnter={() => setHoveredSlot(slot.time)}
              onMouseLeave={() => setHoveredSlot(null)}
            >
              {/* Time Label */}
              <div className="w-20 pt-3 text-sm text-text-secondary">
                {slot.label}
              </div>

              {/* Slot Content */}
              <div className="flex-1">
                {task ? (
                  <TimeBlock
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onComplete={onCompleteTask}
                    onStart={onStartTask}
                    onPause={onPauseTask}
                  />
                ) : (
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-lg border border-dashed p-4 transition-all',
                      isHovered
                        ? 'border-accent/50 bg-accent/5'
                        : 'border-border'
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'text-text-tertiary transition-opacity',
                        isHovered ? 'opacity-100' : 'opacity-0'
                      )}
                      onClick={() => onAddTask?.(slot.time)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add task at {slot.label}
                    </Button>
                    {!isHovered && (
                      <span className="text-sm text-text-tertiary">
                        Empty block
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
