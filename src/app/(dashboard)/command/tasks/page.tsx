'use client'

import { useState, useMemo } from 'react'
import { Plus, Filter, Search, Loader2, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TaskCard } from '@/components/modules/command/TaskCard'
import { TaskForm } from '@/components/modules/command/TaskForm'
import { useTasks, useCreateTask, useDeleteTask } from '@/hooks/use-tasks'
import { useGoals } from '@/hooks/use-goals'
import { categoryList } from '@/config/categories'
import type { TaskFormData } from '@/components/modules/command/TaskForm'

type WorkflowTab = 'backlog' | 'scheduled' | 'completed'

const workflowTabs: { id: WorkflowTab; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'completed', label: 'Completed' },
]

function formatScheduledDate(date: string | Date | null): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<WorkflowTab>('backlog')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)
  const [taskFormOpen, setTaskFormOpen] = useState(false)

  // Build filters per tab — category filter applies to all
  const catFilter = categoryFilter ? { category: categoryFilter } : {}
  const backlogFilter = { scheduled: 'false', ...catFilter }
  const scheduledFilter = { scheduled: 'true', ...catFilter }
  const completedFilter = { status: 'DONE', ...catFilter }

  const { data: backlogRaw = [], isLoading: backlogLoading } = useTasks(backlogFilter)
  const { data: scheduledRaw = [], isLoading: scheduledLoading } = useTasks(scheduledFilter)
  const { data: completedAll = [], isLoading: completedLoading } = useTasks(completedFilter)

  // Client-filter: exclude DONE and activity-based tasks (those belong to Day Builder)
  const backlogTasks = useMemo(() => backlogRaw.filter((t) => t.status !== 'DONE' && !t.activityId), [backlogRaw])
  const scheduledTasks = useMemo(() => scheduledRaw.filter((t) => t.status !== 'DONE' && !t.activityId), [scheduledRaw])
  const completedTasks = useMemo(() => completedAll.filter((t) => !t.activityId), [completedAll])

  const { data: goals = [] } = useGoals({ completed: 'false' })
  const createTask = useCreateTask()
  const deleteTask = useDeleteTask()

  // Pick the active dataset and loading state
  const activeData = activeTab === 'backlog' ? backlogTasks : activeTab === 'scheduled' ? scheduledTasks : completedTasks
  const isLoading = activeTab === 'backlog' ? backlogLoading : activeTab === 'scheduled' ? scheduledLoading : completedLoading

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return activeData
    const q = searchQuery.toLowerCase()
    return activeData.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    )
  }, [activeData, searchQuery])

  const tabCounts: Record<WorkflowTab, number> = {
    backlog: backlogTasks.length,
    scheduled: scheduledTasks.length,
    completed: completedTasks.length,
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

  function handleDeleteTask(id: string) {
    deleteTask.mutate(id, {
      onSuccess: () => toast.success('Task deleted'),
      onError: (err) => toast.error(err.message || 'Failed to delete task'),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="text-sm text-text-secondary">
            Manage your task queue and schedule
          </p>
        </div>
        <Button onClick={() => setTaskFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className={categoryFilter ? 'border-accent text-accent' : ''}
          >
            <Filter className="h-4 w-4" />
          </Button>
          {showCategoryFilter && (
            <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-lg border border-border bg-surface-elevated p-2 shadow-lg">
              <button
                onClick={() => {
                  setCategoryFilter(null)
                  setShowCategoryFilter(false)
                }}
                className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                  !categoryFilter
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:bg-surface'
                }`}
              >
                All Categories
              </button>
              {categoryList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoryFilter(cat.id)
                    setShowCategoryFilter(false)
                  }}
                  className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                    categoryFilter === cat.id
                      ? `${cat.bgColor} ${cat.textColor}`
                      : 'text-text-secondary hover:bg-surface'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Workflow Tabs */}
      <div className="flex gap-2 border-b border-border">
        {workflowTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-text-tertiary">
              {tabCounts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
              <p className="mt-2 text-sm text-text-tertiary">Loading tasks...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-surface-elevated p-4 mb-4">
                <Plus className="h-8 w-8 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || categoryFilter ? 'No matching tasks' : 'No tasks yet'}
              </h3>
              <p className="text-sm text-text-secondary mb-4 max-w-sm">
                {searchQuery || categoryFilter
                  ? 'Try adjusting your filters or search query.'
                  : 'Create your first task to start organizing your work into 90-minute blocks.'}
              </p>
              {!searchQuery && !categoryFilter && (
                <Button onClick={() => setTaskFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div key={task.id}>
              <TaskCard
                task={task}
                onDelete={handleDeleteTask}
                isDraggable={false}
              />
              {activeTab !== 'backlog' && task.scheduledDate && (
                <div className="flex items-center gap-1.5 ml-4 mt-1 mb-1">
                  <Calendar className="h-3 w-3 text-text-tertiary" />
                  <span className="text-xs text-text-tertiary">
                    {formatScheduledDate(task.scheduledDate)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Task Form Dialog */}
      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={handleCreateTask}
        goals={goals}
      />
    </div>
  )
}
