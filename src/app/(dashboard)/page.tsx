'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Plus, Target, Clock, TrendingUp } from 'lucide-react'
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
  GoalsPanel,
  ActivityCatalog,
  TaskForm,
  ActivityForm,
} from '@/components/modules/command'
import { useTasks, useCreateTask, useUpdateTask } from '@/hooks/use-tasks'
import { useActivities, useCreateActivity, useUpdateActivity, useDeleteActivity } from '@/hooks/use-activities'
import { useGoals, useCreateGoal, useUpdateGoal } from '@/hooks/use-goals'
import type { Activity, GoalType } from '@prisma/client'
import type { TaskFormData } from '@/components/modules/command/TaskForm'

const DEFAULT_SLOTS = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00']

export default function DayBuilderPage() {
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')

  // Data queries
  const { data: tasks = [], isLoading: tasksLoading } = useTasks({ date: todayStr })
  const { data: activities = [], isLoading: activitiesLoading } = useActivities()
  const { data: monthlyGoals = [], isLoading: goalsLoading } = useGoals({
    type: 'MONTHLY',
    completed: 'false',
  })

  // Mutations
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
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

  // Computed stats
  const stats = useMemo(() => {
    const completedBlocks = tasks.filter((t) => t.status === 'DONE').length
    const totalBlocks = tasks.length
    const goalProgress =
      monthlyGoals.length > 0
        ? Math.round(
            monthlyGoals.reduce((acc, g) => {
              const target = g.targetValue || 1
              return acc + Math.min(100, (g.currentValue / target) * 100)
            }, 0) / monthlyGoals.length
          )
        : 0
    const goalsCompleted = monthlyGoals.filter((g) => g.completedAt).length

    return { completedBlocks, totalBlocks, goalProgress, goalsCompleted }
  }, [tasks, monthlyGoals])

  // Find next available time slot for today
  function getNextAvailableSlot(): string {
    const usedTimes = new Set(tasks.map((t) => t.scheduledTime))
    return DEFAULT_SLOTS.find((slot) => !usedTimes.has(slot)) || '08:00'
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
    const scheduledDate = data.scheduledDate
      ? new Date(data.scheduledDate + 'T00:00:00').toISOString()
      : undefined

    createTask.mutate({
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
    })
  }

  function handleStartTask(id: string) {
    updateTask.mutate({ id, status: 'IN_PROGRESS' })
  }

  function handleCompleteTask(id: string) {
    updateTask.mutate({ id, status: 'DONE' })
  }

  function handlePauseTask(id: string) {
    updateTask.mutate({ id, status: 'TODO' })
  }

  function handleCreateActivity(data: {
    title: string
    description: string
    category: string
    defaultDuration: number
    energyLevel: string
  }) {
    if (editingActivity) {
      updateActivity.mutate({
        id: editingActivity.id,
        title: data.title,
        description: data.description || undefined,
        category: data.category as Activity['category'],
        defaultDuration: data.defaultDuration,
        energyLevel: data.energyLevel as Activity['energyLevel'],
      })
    } else {
      createActivity.mutate({
        title: data.title,
        description: data.description || undefined,
        category: data.category as Activity['category'],
        defaultDuration: data.defaultDuration,
        energyLevel: data.energyLevel as Activity['energyLevel'],
      })
    }
    setEditingActivity(null)
  }

  function handleEditActivity(activity: Activity) {
    setEditingActivity(activity)
    setActivityFormOpen(true)
  }

  function handleDeleteActivity(id: string) {
    deleteActivity.mutate(id)
  }

  function handleAddGoal() {
    setGoalFormOpen(true)
  }

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Today&apos;s Blocks
            </CardTitle>
            <Clock className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedBlocks} / {stats.totalBlocks}
            </div>
            <p className="text-xs text-text-tertiary">blocks completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Monthly Goals
            </CardTitle>
            <Target className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.goalProgress}%</div>
            <p className="text-xs text-text-tertiary">
              {stats.goalsCompleted} of {monthlyGoals.length} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Activities
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-text-tertiary">in your catalog</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Timeline + Goals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Daily Timeline (2/3 width) */}
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
              onStartTask={handleStartTask}
              onCompleteTask={handleCompleteTask}
              onPauseTask={handlePauseTask}
            />
          )}
        </div>

        {/* Goals Panel (1/3 width) */}
        <div>
          <GoalsPanel
            goals={monthlyGoals}
            activeType={goalType}
            onTypeChange={setGoalType}
            onAddGoal={handleAddGoal}
            onToggleComplete={(id, completed) => {
              updateGoal.mutate({
                id,
                completedAt: completed ? new Date().toISOString() : null,
              })
            }}
          />
        </div>
      </div>

      {/* Activity Catalog */}
      <ActivityCatalog
        activities={activities}
        onSelectActivity={handleSelectActivity}
        onCreateActivity={() => {
          setEditingActivity(null)
          setActivityFormOpen(true)
        }}
        onEditActivity={handleEditActivity}
        onDeleteActivity={handleDeleteActivity}
      />

      {/* Task Form Dialog */}
      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={handleCreateTask}
        initialData={taskFormInitial}
        fromActivity={selectedActivity}
        goals={monthlyGoals}
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
        onSubmit={(data) => createGoal.mutate(data)}
      />
    </div>
  )
}

// Inline goal form dialog since it's simple
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      title,
      type: 'MONTHLY',
      targetValue: targetValue ? parseInt(targetValue, 10) : undefined,
    })
    setTitle('')
    setTargetValue('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New Monthly Goal</DialogTitle>
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

