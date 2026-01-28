'use client'

import { useState } from 'react'
import { format, addDays, isSameDay, startOfWeek } from 'date-fns'
import { Plus, Target, Newspaper, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import {
  DailyTimeline,
  TaskForm,
  GoalFormDialog,
} from '@/components/modules/command'
import { GoalProgressBar } from '@/components/modules/command/GoalProgressBar'
import { computeBreakdown } from '@/lib/utils/goal-cascades'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/use-tasks'
import { useActivities } from '@/hooks/use-activities'
import { useGoals, useCreateGoal, useIncrementGoal } from '@/hooks/use-goals'
import type { Task } from '@prisma/client'
import type { TaskFormData } from '@/components/modules/command/TaskForm'

// Parse a DB date (Prisma @db.Date returns "2026-01-27T00:00:00.000Z")
// as a local calendar date, stripping the UTC timezone to avoid off-by-one.
function parseCalendarDate(d: string | Date): Date {
  const s = typeof d === 'string' ? d : d.toISOString()
  const [datePart] = s.split('T')
  const [y, m, day] = datePart.split('-').map(Number)
  return new Date(y, m - 1, day)
}

export default function DayBuilderPage() {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const selectedStr = format(selectedDate, 'yyyy-MM-dd')
  const isSelectedToday = isSameDay(selectedDate, today)

  // Week days for the day picker
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Data queries — fetch ALL incomplete goals, not just monthly
  const { data: tasks = [], isLoading: tasksLoading } = useTasks({ date: selectedStr })
  const { data: backlogTasks = [] } = useTasks({ scheduled: 'false' })
  const { data: activities = [], isLoading: activitiesLoading } = useActivities()
  const { data: allGoals = [], isLoading: goalsLoading } = useGoals({
    completed: 'false',
  })

  // Mutations
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const createGoal = useCreateGoal()
  const incrementGoal = useIncrementGoal()

  // UI state — create form
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [taskFormInitial, setTaskFormInitial] = useState<Partial<TaskFormData>>({})
  const [goalFormOpen, setGoalFormOpen] = useState(false)

  // UI state — edit form
  const [editFormOpen, setEditFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // UI state — delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  // Handlers — create
  function handleAddTask() {
    setTaskFormInitial({
      scheduledDate: selectedStr,
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
        activityId: data.activityId || undefined,
        goalId: data.goalId || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Task created')
          setTaskFormOpen(false)
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to create task')
        },
      }
    )
  }

  // Handlers — edit
  function handleEditTask(task: Task) {
    setEditingTask(task)
    setEditFormOpen(true)
  }

  function handleEditSubmit(data: TaskFormData) {
    if (!editingTask) return

    const scheduledDate = data.scheduledDate
      ? new Date(data.scheduledDate + 'T00:00:00.000Z').toISOString()
      : null

    updateTask.mutate(
      {
        id: editingTask.id,
        title: data.title,
        description: data.description || null,
        category: data.category,
        priority: data.priority,
        energyLevel: data.energyLevel,
        timeBlockMinutes: data.timeBlockMinutes,
        scheduledDate,
        scheduledTime: data.scheduledTime || null,
        goalId: data.goalId || null,
        activityId: data.activityId || null,
      },
      {
        onSuccess: () => {
          toast.success('Task updated')
          setEditFormOpen(false)
          setEditingTask(null)
        },
        onError: (err) => toast.error(err.message || 'Failed to update task'),
      }
    )
  }

  // Handlers — status changes
  function handleCompleteTask(id: string) {
    updateTask.mutate(
      { id, status: 'DONE' },
      {
        onSuccess: () => toast.success('Task completed'),
        onError: (err) => toast.error(err.message || 'Failed to complete task'),
      }
    )
  }

  // Handlers — delete with confirmation
  function handleDeleteTask(id: string) {
    setDeletingTaskId(id)
    setDeleteDialogOpen(true)
  }

  function confirmDelete() {
    if (!deletingTaskId) return
    deleteTask.mutate(deletingTaskId, {
      onSuccess: () => {
        toast.success('Task deleted')
        setDeleteDialogOpen(false)
        setDeletingTaskId(null)
      },
      onError: (err) => toast.error(err.message || 'Failed to delete task'),
    })
  }

  // Handlers — schedule existing backlog task
  function handleScheduleExistingTask(taskId: string, scheduledDate: string, scheduledTime: string) {
    const isoDate = scheduledDate
      ? new Date(scheduledDate + 'T00:00:00.000Z').toISOString()
      : new Date(selectedStr + 'T00:00:00.000Z').toISOString()

    updateTask.mutate(
      {
        id: taskId,
        scheduledDate: isoDate,
        scheduledTime: scheduledTime || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Task scheduled')
          setTaskFormOpen(false)
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to schedule task')
        },
      }
    )
  }

  function handleAddGoal() {
    setGoalFormOpen(true)
  }

  function handleIncrementGoal(id: string, value: number) {
    incrementGoal.mutate(
      { id, incrementValue: value },
      {
        onSuccess: () => toast.success('Progress updated'),
        onError: (err) => toast.error(err.message || 'Failed to update progress'),
      }
    )
  }

  // Build edit form initial data from editing task
  const editFormInitial: Partial<TaskFormData> | undefined = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description || '',
        category: editingTask.category,
        priority: editingTask.priority,
        energyLevel: editingTask.energyLevel,
        timeBlockMinutes: editingTask.timeBlockMinutes || 90,
        scheduledDate: editingTask.scheduledDate
          ? format(parseCalendarDate(editingTask.scheduledDate), 'yyyy-MM-dd')
          : '',
        scheduledTime: editingTask.scheduledTime || '',
        activityId: editingTask.activityId || '',
        goalId: editingTask.goalId || '',
      }
    : undefined

  const isLoading = tasksLoading || activitiesLoading || goalsLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Command Center</h1>
          <p className="text-sm text-text-secondary">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          New Block
        </Button>
      </div>

      {/* Day picker */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setSelectedDate((d) => addDays(d, -7))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-1 gap-1">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate)
            const isToday = isSameDay(day, today)
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'flex flex-1 flex-col items-center rounded-lg py-1.5 transition-colors',
                  isSelected
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
                )}
              >
                <span className="text-[10px] uppercase tracking-wide">
                  {format(day, 'EEE')}
                </span>
                <span
                  className={cn(
                    'text-sm',
                    isSelected ? 'font-semibold' : isToday ? 'font-bold' : 'font-medium',
                  )}
                >
                  {format(day, 'd')}
                </span>
              </button>
            )
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setSelectedDate((d) => addDays(d, 7))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content: Timeline (left) + Goals & Intel Feed (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily Timeline */}
        <div>
          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-sm text-text-tertiary">
                  Loading your day...
                </p>
              </CardContent>
            </Card>
          ) : (
            <DailyTimeline
              date={selectedDate}
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onCompleteTask={handleCompleteTask}
            />
          )}
        </div>

        {/* Right column: Goals + Intel Feed */}
        <div className="space-y-6">
          {/* Goals Card — compact overview */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-text-tertiary" />
                  <CardTitle className="text-base">Goals</CardTitle>
                  <span className="text-xs text-text-tertiary">
                    {allGoals.filter((g) => !g.completedAt).length} active
                  </span>
                </div>
                <Link
                  href="/command/goals"
                  className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent transition-colors"
                >
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const incomplete = allGoals
                  .filter((g) => !g.completedAt)
                  .sort((a, b) => {
                    const bA = a.targetValue ? computeBreakdown({ type: a.type, targetValue: a.targetValue, currentValue: a.currentValue, startDate: a.startDate, dueDate: a.dueDate }) : undefined
                    const bB = b.targetValue ? computeBreakdown({ type: b.type, targetValue: b.targetValue, currentValue: b.currentValue, startDate: b.startDate, dueDate: b.dueDate }) : undefined
                    if (bA?.isOnTrack === false && bB?.isOnTrack !== false) return -1
                    if (bA?.isOnTrack !== false && bB?.isOnTrack === false) return 1
                    return (bA?.progressPercent ?? 0) - (bB?.progressPercent ?? 0)
                  })

                if (incomplete.length === 0) {
                  return <p className="text-xs text-text-tertiary py-1">No active goals</p>
                }

                return (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {incomplete.map((goal) => {
                      const hasTarget = goal.targetValue !== null && goal.targetValue > 0
                      const breakdown = hasTarget
                        ? computeBreakdown({ type: goal.type, targetValue: goal.targetValue!, currentValue: goal.currentValue, startDate: goal.startDate, dueDate: goal.dueDate })
                        : undefined
                      return (
                        <div key={goal.id} className="flex items-center gap-2">
                          {hasTarget && breakdown && (
                            <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', breakdown.isOnTrack ? 'bg-green-400' : 'bg-amber-400')} />
                          )}
                          <span className="text-sm font-medium truncate flex-1">{goal.title}</span>
                          {hasTarget && (
                            <span className="text-sm text-text-secondary shrink-0">
                              {goal.currentValue}/{goal.targetValue}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* Intel Feed — placeholder for curated news, alerts, notifications */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-text-tertiary" />
                <CardTitle className="text-base">Intel Feed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Newspaper className="h-8 w-8 text-text-tertiary/50 mb-3" />
                <p className="text-sm text-text-secondary font-medium">
                  Coming Soon
                </p>
                <p className="text-xs text-text-tertiary mt-1 max-w-[240px]">
                  Curated news, email alerts, and notifications will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Task Form Dialog */}
      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={handleCreateTask}
        initialData={taskFormInitial}
        goals={allGoals}
        activities={activities}
        backlogTasks={backlogTasks}
        onScheduleExistingTask={handleScheduleExistingTask}
      />

      {/* Edit Task Form Dialog */}
      {editingTask && (
        <TaskForm
          open={editFormOpen}
          onOpenChange={(open) => {
            setEditFormOpen(open)
            if (!open) setEditingTask(null)
          }}
          onSubmit={handleEditSubmit}
          initialData={editFormInitial}
          isEditing
          goals={allGoals}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete task?"
        description="This will permanently delete this task. This action cannot be undone."
        isPending={deleteTask.isPending}
      />

      {/* Goal Form Dialog */}
      <GoalFormDialog
        open={goalFormOpen}
        onOpenChange={setGoalFormOpen}
        onSubmit={(data) =>
          createGoal.mutate(data, {
            onSuccess: () => {
              toast.success('Goal created')
              setGoalFormOpen(false)
            },
            onError: (err) => toast.error(err.message || 'Failed to create goal'),
          })
        }
      />
    </div>
  )
}
