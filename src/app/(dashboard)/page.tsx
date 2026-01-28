'use client'

import { useState, useCallback } from 'react'
import { format } from 'date-fns'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { Plus, Target } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DailyTimeline,
  CommandSidebar,
  TaskForm,
  ActivityForm,
  ActivityCardInner,
  TaskBacklogCardInner,
  GoalsPanelContent,
} from '@/components/modules/command'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/use-tasks'
import { useActivities, useCreateActivity, useUpdateActivity, useDeleteActivity } from '@/hooks/use-activities'
import { useGoals, useCreateGoal, useUpdateGoal } from '@/hooks/use-goals'
import type { Activity, Task, GoalType } from '@prisma/client'
import type { TaskFormData } from '@/components/modules/command/TaskForm'

const DEFAULT_SLOTS = [
  '06:30', '07:30', '09:00', '10:30',
  '12:00', '13:30', '15:00', '16:30',
  '18:00', '19:30', '21:00',
]

export default function DayBuilderPage() {
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')

  // Data queries — fetch ALL incomplete goals, not just monthly
  const { data: tasks = [], isLoading: tasksLoading } = useTasks({ date: todayStr })
  const { data: backlogTasks = [] } = useTasks({ scheduled: 'false' })
  const { data: activities = [], isLoading: activitiesLoading } = useActivities()
  const { data: allGoals = [], isLoading: goalsLoading } = useGoals({
    completed: 'false',
  })

  // Mutations
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const createActivity = useCreateActivity()
  const updateActivity = useUpdateActivity()
  const deleteActivity = useDeleteActivity()
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()

  // UI state
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [activityFormOpen, setActivityFormOpen] = useState(false)
  const [goalFormOpen, setGoalFormOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [taskFormInitial, setTaskFormInitial] = useState<Partial<TaskFormData>>({})
  const [goalType, setGoalType] = useState<GoalType>('MONTHLY')
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  // Find next available time slot with enough remaining capacity
  function getNextAvailableSlot(minMinutes = 1): string {
    return DEFAULT_SLOTS.find((slot) => {
      const slotTasks = tasks.filter((t) => t.scheduledTime === slot)
      const used = slotTasks.reduce((sum, t) => sum + (t.timeBlockMinutes || 90), 0)
      return (90 - used) >= minMinutes
    }) || '08:00'
  }

  // Handlers
  function handleSelectActivity(activity: Activity) {
    setSelectedActivity(activity)
    setTaskFormInitial({
      scheduledDate: todayStr,
      scheduledTime: getNextAvailableSlot(),
    })
    setTaskFormOpen(true)
  }

  function handleAddTaskAtTime(time: string) {
    setSelectedActivity(null)
    setTaskFormInitial({
      scheduledDate: todayStr,
      scheduledTime: time,
    })
    setTaskFormOpen(true)
  }

  function handleCreateTask(data: TaskFormData) {
    // Use UTC midnight so @db.Date stores the correct calendar date
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

  function handleStartTask(id: string) {
    updateTask.mutate(
      { id, status: 'IN_PROGRESS' },
      {
        onSuccess: () => toast.success('Task started'),
        onError: (err) => toast.error(err.message || 'Failed to start task'),
      }
    )
  }

  function handleCompleteTask(id: string) {
    updateTask.mutate(
      { id, status: 'DONE' },
      {
        onSuccess: () => toast.success('Task completed'),
        onError: (err) => toast.error(err.message || 'Failed to complete task'),
      }
    )
  }

  function handlePauseTask(id: string) {
    updateTask.mutate(
      { id, status: 'TODO' },
      {
        onSuccess: () => toast.success('Task paused'),
        onError: (err) => toast.error(err.message || 'Failed to pause task'),
      }
    )
  }

  function handleDeleteTask(id: string) {
    deleteTask.mutate(id, {
      onSuccess: () => toast.success('Task deleted'),
      onError: (err) => toast.error(err.message || 'Failed to delete task'),
    })
  }

  function handleCreateActivity(data: {
    title: string
    description: string
    category: string
    defaultDuration: number
    energyLevel: string
  }) {
    if (editingActivity) {
      updateActivity.mutate(
        {
          id: editingActivity.id,
          title: data.title,
          description: data.description || undefined,
          category: data.category as Activity['category'],
          defaultDuration: data.defaultDuration,
          energyLevel: data.energyLevel as Activity['energyLevel'],
        },
        {
          onSuccess: () => {
            toast.success('Activity updated')
            setActivityFormOpen(false)
            setEditingActivity(null)
          },
          onError: (err) => toast.error(err.message || 'Failed to update activity'),
        }
      )
    } else {
      createActivity.mutate(
        {
          title: data.title,
          description: data.description || undefined,
          category: data.category as Activity['category'],
          defaultDuration: data.defaultDuration,
          energyLevel: data.energyLevel as Activity['energyLevel'],
        },
        {
          onSuccess: () => {
            toast.success('Activity created')
            setActivityFormOpen(false)
          },
          onError: (err) => toast.error(err.message || 'Failed to create activity'),
        }
      )
    }
  }

  function handleEditActivity(activity: Activity) {
    setEditingActivity(activity)
    setActivityFormOpen(true)
  }

  function handleDeleteActivity(id: string) {
    deleteActivity.mutate(id, {
      onSuccess: () => toast.success('Activity deleted'),
      onError: (err) => toast.error(err.message || 'Failed to delete activity'),
    })
  }

  function handleAddGoal() {
    setGoalFormOpen(true)
  }

  // Drag-and-drop handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current
    if (data?.type === 'activity') {
      setActiveActivity(data.activity as Activity)
    } else if (data?.type === 'task') {
      setActiveTask(data.task as Task)
    }
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveActivity(null)
      setActiveTask(null)
      const { active, over } = event
      if (!over) return

      const activeData = active.data.current
      const overData = over.data.current
      if (overData?.type !== 'timeline-slot') return

      const time = overData.time as string
      const maxMinutes = (overData.maxMinutes as number) ?? 90
      const scheduledDate = new Date(todayStr + 'T00:00:00.000Z').toISOString()

      if (activeData?.type === 'activity') {
        const activity = activeData.activity as Activity
        const duration = activity.defaultDuration

        if (duration > maxMinutes) {
          toast.error(
            `"${activity.title}" is ${duration}m but only ${maxMinutes}m available in this slot`
          )
          return
        }

        createTask.mutate(
          {
            title: activity.title,
            description: activity.description || undefined,
            category: activity.category,
            priority: 'MEDIUM',
            energyLevel: activity.energyLevel,
            timeBlockMinutes: duration,
            scheduledDate,
            scheduledTime: time,
            activityId: activity.id,
          },
          {
            onSuccess: () => toast.success(`Added "${activity.title}" at ${time}`),
            onError: (err) => toast.error(err.message || 'Failed to create task'),
          }
        )
      } else if (activeData?.type === 'task') {
        const task = activeData.task as Task
        const duration = task.timeBlockMinutes || 90

        if (duration > maxMinutes) {
          toast.error(
            `"${task.title}" is ${duration}m but only ${maxMinutes}m available in this slot`
          )
          return
        }

        updateTask.mutate(
          {
            id: task.id,
            scheduledDate,
            scheduledTime: time,
          },
          {
            onSuccess: () => toast.success(`Scheduled "${task.title}" at ${time}`),
            onError: (err) => toast.error(err.message || 'Failed to schedule task'),
          }
        )
      }
    },
    [todayStr, createTask, updateTask]
  )

  const handleDragCancel = useCallback(() => {
    setActiveActivity(null)
    setActiveTask(null)
  }, [])

  const isLoading = tasksLoading || activitiesLoading || goalsLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Command Center</h1>
          <p className="text-sm text-text-secondary">
            {format(today, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedActivity(null)
            setTaskFormInitial({
              scheduledDate: todayStr,
              scheduledTime: getNextAvailableSlot(),
            })
            setTaskFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Block
        </Button>
      </div>

      {/* Main Content: Timeline (left) + Goals / Activities (right) */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Daily Timeline — full height left column */}
          <div className="lg:col-span-2">
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
                date={today}
                tasks={tasks}
                onAddTask={handleAddTaskAtTime}
                onDeleteTask={handleDeleteTask}
                onStartTask={handleStartTask}
                onCompleteTask={handleCompleteTask}
                onPauseTask={handlePauseTask}
              />
            )}
          </div>

          {/* Right column: Goals (top) + Activities/Backlog (bottom) */}
          <div className="space-y-6">
            {/* Goals Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-text-tertiary" />
                  <CardTitle className="text-base">Goals</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <GoalsPanelContent
                  goals={allGoals}
                  activeType={goalType}
                  onTypeChange={setGoalType}
                  onAddGoal={handleAddGoal}
                  onToggleComplete={(id, completed) => {
                    updateGoal.mutate(
                      {
                        id,
                        completedAt: completed ? new Date().toISOString() : null,
                      },
                      {
                        onSuccess: () =>
                          toast.success(completed ? 'Goal completed' : 'Goal reopened'),
                        onError: (err) =>
                          toast.error(err.message || 'Failed to update goal'),
                      }
                    )
                  }}
                />
              </CardContent>
            </Card>

            {/* Activities / Backlog Sidebar */}
            <CommandSidebar
              activities={activities}
              onSelectActivity={handleSelectActivity}
              onCreateActivity={() => {
                setEditingActivity(null)
                setActivityFormOpen(true)
              }}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
              backlogTasks={backlogTasks}
            />
          </div>
        </div>

        {/* Drag Overlay — floating card while dragging */}
        <DragOverlay>
          {activeActivity ? (
            <div className="w-56 opacity-90">
              <ActivityCardInner
                activity={activeActivity}
                onSelect={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : activeTask ? (
            <div className="w-56 opacity-90">
              <TaskBacklogCardInner task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Form Dialog */}
      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={handleCreateTask}
        initialData={taskFormInitial}
        fromActivity={selectedActivity}
        goals={allGoals}
        activities={activities}
      />

      {/* Activity Form Dialog */}
      <ActivityForm
        open={activityFormOpen}
        onOpenChange={(open) => {
          setActivityFormOpen(open)
          if (!open) setEditingActivity(null)
        }}
        onSubmit={handleCreateActivity}
        editingActivity={editingActivity}
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

// Inline goal form dialog — supports picking goal type
function GoalFormDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { title: string; type: string; targetValue?: number; dueDate?: string }) => void
}) {
  const [title, setTitle] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [goalType, setGoalType] = useState<GoalType>('MONTHLY')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      title,
      type: goalType,
      targetValue: targetValue ? parseInt(targetValue, 10) : undefined,
    })
    setTitle('')
    setTargetValue('')
    setGoalType('MONTHLY')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goalTitle">Goal *</Label>
            <Input
              id="goalTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. "Complete 3 client projects"'
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              {(['DAILY', 'WEEKLY', 'MONTHLY'] as GoalType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setGoalType(type)}
                  className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    goalType === type
                      ? 'border-text-primary/30 bg-white/10 text-text-primary'
                      : 'border-border text-text-secondary hover:border-border/80'
                  }`}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goalTarget">Target Count (optional)</Label>
            <Input
              id="goalTarget"
              type="number"
              min="1"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="e.g. 30"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
