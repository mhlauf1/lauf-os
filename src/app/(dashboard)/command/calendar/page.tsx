'use client'

import { useState, useMemo } from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TaskForm } from '@/components/modules/command/TaskForm'
import { useTasks, useCreateTask } from '@/hooks/use-tasks'
import { useGoals } from '@/hooks/use-goals'
import { getCategoryConfig } from '@/config/categories'
import type { Task, TaskCategory } from '@prisma/client'
import type { TaskFormData } from '@/components/modules/command/TaskForm'

const timeSlots = [
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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = addDays(weekStart, 6)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const dateFrom = format(weekStart, 'yyyy-MM-dd')
  const dateTo = format(weekEnd, 'yyyy-MM-dd')

  const { data: tasks = [], isLoading } = useTasks({ dateFrom, dateTo })
  const { data: goals = [] } = useGoals({ completed: 'false' })
  const createTask = useCreateTask()

  // Task form state
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [taskFormInitial, setTaskFormInitial] = useState<Partial<TaskFormData>>({})

  // Parse a DB date (Prisma @db.Date returns "2026-01-27T00:00:00.000Z")
  // as a local calendar date, stripping the UTC timezone to avoid off-by-one.
  function parseCalendarDate(d: string | Date): Date {
    const s = typeof d === 'string' ? d : d.toISOString()
    const [datePart] = s.split('T')
    const [y, m, day] = datePart.split('-').map(Number)
    return new Date(y, m - 1, day)
  }

  // Group tasks by day and time
  const tasksByDayTime = useMemo(() => {
    const map: Record<string, Task[]> = {}
    for (const task of tasks) {
      if (task.scheduledDate && task.scheduledTime) {
        const dayKey = format(parseCalendarDate(task.scheduledDate), 'yyyy-MM-dd')
        const key = `${dayKey}-${task.scheduledTime}`
        if (!map[key]) map[key] = []
        map[key].push(task)
      }
    }
    return map
  }, [tasks])

  // Count tasks per day
  const taskCountByDay = useMemo(() => {
    const map: Record<string, number> = {}
    for (const task of tasks) {
      if (task.scheduledDate) {
        const dayKey = format(parseCalendarDate(task.scheduledDate), 'yyyy-MM-dd')
        map[dayKey] = (map[dayKey] || 0) + 1
      }
    }
    return map
  }, [tasks])

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) =>
      addDays(prev, direction === 'prev' ? -7 : 7)
    )
  }

  function handleAddTaskAtSlot(day: Date, time: string) {
    setTaskFormInitial({
      scheduledDate: format(day, 'yyyy-MM-dd'),
      scheduledTime: time,
    })
    setTaskFormOpen(true)
  }

  function handleCreateTask(data: TaskFormData) {
    const scheduledDate = data.scheduledDate
      ? new Date(data.scheduledDate + 'T00:00:00.000Z').toISOString()
      : undefined

    createTask.mutate(
      {
        title: data.title,
        description: data.description || undefined,
        category: data.category,
        priority: data.priority,
        energyLevel: data.energyLevel,
        timeBlockMinutes: data.timeBlockMinutes,
        scheduledDate,
        scheduledTime: data.scheduledTime || undefined,
        goalId: data.goalId || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Task created')
          setTaskFormOpen(false)
        },
        onError: (err) => toast.error(err.message || 'Failed to create task'),
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <p className="text-sm text-text-secondary">
            Week of {format(weekStart, 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
              <p className="mt-2 text-sm text-text-tertiary">Loading calendar...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-8 border-b border-border">
              {/* Time column header */}
              <div className="border-r border-border p-3" />
              {/* Day headers */}
              {weekDays.map((day) => {
                const dayKey = format(day, 'yyyy-MM-dd')
                const count = taskCountByDay[dayKey] || 0
                return (
                  <div
                    key={day.toISOString()}
                    className={`border-r border-border p-3 text-center last:border-r-0 ${
                      isSameDay(day, new Date())
                        ? 'bg-accent/10'
                        : ''
                    }`}
                  >
                    <p className="text-xs text-text-secondary">
                      {format(day, 'EEE')}
                    </p>
                    <p
                      className={`text-lg font-medium ${
                        isSameDay(day, new Date())
                          ? 'text-accent'
                          : ''
                      }`}
                    >
                      {format(day, 'd')}
                    </p>
                    {count > 0 && (
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {count} task{count !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Time slots */}
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 border-b border-border last:border-b-0">
                {/* Time label */}
                <div className="border-r border-border p-3 text-xs text-text-secondary">
                  {formatTimeLabel(time)}
                </div>
                {/* Day cells */}
                {weekDays.map((day) => {
                  const dayKey = format(day, 'yyyy-MM-dd')
                  const cellKey = `${dayKey}-${time}`
                  const cellTasks = tasksByDayTime[cellKey] || []

                  return (
                    <div
                      key={cellKey}
                      className={`border-r border-border p-1.5 last:border-r-0 min-h-[80px] transition-colors hover:bg-surface group ${
                        isSameDay(day, new Date()) ? 'bg-accent/5' : ''
                      }`}
                    >
                      {cellTasks.length > 0 ? (
                        <div className="space-y-1">
                          {cellTasks.map((task) => {
                            const catConfig = getCategoryConfig(task.category as TaskCategory)
                            return (
                              <div
                                key={task.id}
                                className="rounded-md border border-border p-1.5 text-xs"
                                style={{
                                  borderLeftWidth: '3px',
                                  borderLeftColor: catConfig.color,
                                }}
                              >
                                <p className="font-medium truncate">{task.title}</p>
                                <p className="text-text-tertiary mt-0.5">
                                  {task.timeBlockMinutes}m
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddTaskAtSlot(day, time)}
                          className="w-full h-full flex items-center justify-center text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Task Form Dialog */}
      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={handleCreateTask}
        initialData={taskFormInitial}
        goals={goals}
      />
    </div>
  )
}
