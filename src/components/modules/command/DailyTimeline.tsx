'use client'

import { useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { useDroppable } from '@dnd-kit/core'
import { Plus, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeBlock } from './TimeBlock'
import type { Task } from '@prisma/client'

const SLOT_HEIGHT_PX = 120
const SLOT_TOTAL_MINUTES = 90

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

// Default day schedule: 6:30 AM – 9:30 PM (90-min blocks)
const DEFAULT_SLOTS = [
  '06:30', '08:00', '09:30', '11:00',
  '12:30', '14:00', '15:30', '17:00',
  '18:30', '20:00', '21:30',
]

function formatTimeLabel(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`
}

// Parse a DB date (Prisma @db.Date returns "2026-01-27T00:00:00.000Z")
// as a local calendar date, ignoring the UTC timezone suffix.
// Without this, US timezones see the previous day (midnight UTC = evening prior day locally).
function parseCalendarDate(d: string | Date): Date {
  const s = typeof d === 'string' ? d : d.toISOString()
  // Extract YYYY-MM-DD and treat as local midnight
  const [datePart] = s.split('T')
  const [y, m, day] = datePart.split('-').map(Number)
  return new Date(y, m - 1, day)
}

function getRemainingMinutes(slotTasks: Task[]): number {
  const used = slotTasks.reduce((sum, t) => sum + (t.timeBlockMinutes || SLOT_TOTAL_MINUTES), 0)
  return Math.max(0, SLOT_TOTAL_MINUTES - used)
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

  // Get all tasks for a specific time slot, sorted by creation time
  const getTasksForSlot = (time: string): Task[] => {
    return tasks
      .filter(
        (task) =>
          task.scheduledTime === time &&
          task.scheduledDate &&
          isSameDay(parseCalendarDate(task.scheduledDate), date)
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
          const slotTasks = getTasksForSlot(slot.time)
          const remaining = getRemainingMinutes(slotTasks)
          const isHovered = hoveredSlot === slot.time
          const isEmpty = slotTasks.length === 0

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

              {/* Slot Content — fixed height container */}
              <div
                className="flex-1 flex flex-col gap-1"
                style={{ height: SLOT_HEIGHT_PX }}
              >
                {isEmpty ? (
                  <EmptySlot
                    time={slot.time}
                    label={slot.label}
                    isHovered={isHovered}
                    onAddTask={onAddTask}
                    maxMinutes={SLOT_TOTAL_MINUTES}
                  />
                ) : (
                  <>
                    {slotTasks.map((task) => {
                      const pct = Math.min(
                        ((task.timeBlockMinutes || SLOT_TOTAL_MINUTES) / SLOT_TOTAL_MINUTES) * 100,
                        100
                      )
                      return (
                        <div
                          key={task.id}
                          style={{ height: `${pct}%` }}
                        >
                          <TimeBlock
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                            onComplete={onCompleteTask}
                            onStart={onStartTask}
                            onPause={onPauseTask}
                          />
                        </div>
                      )
                    })}
                    {remaining > 0 && (
                      <RemainderSlot
                        time={slot.time}
                        remainingMinutes={remaining}
                        onAddTask={onAddTask}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

interface EmptySlotProps {
  time: string
  label: string
  isHovered: boolean
  onAddTask?: (time: string) => void
  maxMinutes?: number
}

function EmptySlot({ time, label, isHovered, onAddTask, maxMinutes = SLOT_TOTAL_MINUTES }: EmptySlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${time}`,
    data: { type: 'timeline-slot', time, maxMinutes },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-full items-center justify-center rounded-lg border border-dashed transition-all',
        isOver
          ? 'border-accent bg-accent/10 ring-2 ring-accent/30'
          : isHovered
            ? 'border-accent/50 bg-accent/5'
            : 'border-border'
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'text-text-tertiary transition-opacity',
          isHovered || isOver ? 'opacity-100' : 'opacity-0'
        )}
        onClick={() => onAddTask?.(time)}
      >
        <Plus className="mr-2 h-4 w-4" />
        {isOver ? 'Drop to create' : `Add task at ${label}`}
      </Button>
      {!isHovered && !isOver && (
        <span className="text-sm text-text-tertiary">Empty block</span>
      )}
    </div>
  )
}

interface RemainderSlotProps {
  time: string
  remainingMinutes: number
  onAddTask?: (time: string) => void
}

function RemainderSlot({ time, remainingMinutes, onAddTask }: RemainderSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${time}-remainder`,
    data: { type: 'timeline-slot', time, maxMinutes: remainingMinutes },
  })

  return (
    <div
      ref={setNodeRef}
      onClick={() => onAddTask?.(time)}
      className={cn(
        'flex flex-1 cursor-pointer items-center justify-center rounded border border-dashed text-xs transition-all',
        isOver
          ? 'border-accent bg-accent/10 text-accent ring-1 ring-accent/30'
          : 'border-border/60 text-text-tertiary hover:border-accent/50 hover:bg-accent/5'
      )}
    >
      <Plus className="mr-1 h-3 w-3" />
      +{remainingMinutes}m
    </div>
  )
}
