'use client'

import { useState } from 'react'
import { format, addMinutes, setHours, setMinutes, isSameDay } from 'date-fns'
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
  onCompleteTask?: (id: string) => void
  onStartTask?: (id: string) => void
  onPauseTask?: (id: string) => void
  workStartHour?: number
  workEndHour?: number
  blockDuration?: number
}

export function DailyTimeline({
  date,
  tasks,
  onAddTask,
  onEditTask,
  onCompleteTask,
  onStartTask,
  onPauseTask,
  workStartHour = 8,
  workEndHour = 18,
  blockDuration = 90,
}: DailyTimelineProps) {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)

  // Generate time slots
  const generateTimeSlots = () => {
    const slots: { time: string; date: Date }[] = []
    let currentTime = setMinutes(setHours(date, workStartHour), 0)
    const endTime = setMinutes(setHours(date, workEndHour), 0)

    while (currentTime < endTime) {
      slots.push({
        time: format(currentTime, 'HH:mm'),
        date: currentTime,
      })
      currentTime = addMinutes(currentTime, blockDuration)
    }

    return slots
  }

  const timeSlots = generateTimeSlots()

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
              <div className="w-16 pt-3 text-sm text-text-secondary">
                {slot.time}
              </div>

              {/* Slot Content */}
              <div className="flex-1">
                {task ? (
                  <TimeBlock
                    task={task}
                    onEdit={onEditTask}
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
                      Add task at {slot.time}
                    </Button>
                    {!isHovered && (
                      <span className="text-sm text-text-tertiary">
                        Empty {blockDuration}-min block
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
