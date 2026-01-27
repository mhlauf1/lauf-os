'use client'

import { useState, useMemo } from 'react'
import { Plus, Target, TrendingUp, CheckCircle, Circle, Loader2 } from 'lucide-react'
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
import { useGoals, useCreateGoal, useUpdateGoal } from '@/hooks/use-goals'
import type { Goal, GoalType } from '@prisma/client'

const goalTabs: { id: GoalType; label: string }[] = [
  { id: 'DAILY', label: 'Daily' },
  { id: 'WEEKLY', label: 'Weekly' },
  { id: 'MONTHLY', label: 'Monthly' },
  { id: 'YEARLY', label: 'Yearly' },
]

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState<GoalType>('WEEKLY')
  const [goalFormOpen, setGoalFormOpen] = useState(false)

  const { data: allGoals = [], isLoading } = useGoals({})
  const updateGoal = useUpdateGoal()
  const createGoal = useCreateGoal()

  const filteredGoals = useMemo(
    () => allGoals.filter((g) => g.type === activeTab),
    [allGoals, activeTab]
  )

  const stats = useMemo(() => {
    const completed = allGoals.filter((g) => g.completedAt).length
    const inProgress = allGoals.filter((g) => !g.completedAt).length
    const total = allGoals.length
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, inProgress, rate }
  }, [allGoals])

  function toggleGoalCompletion(goal: Goal) {
    if (goal.completedAt) {
      updateGoal.mutate({ id: goal.id, completedAt: null })
    } else {
      updateGoal.mutate({ id: goal.id, completedAt: new Date().toISOString() })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Goals</h1>
          <p className="text-sm text-text-secondary">
            Track your progress and stay accountable
          </p>
        </div>
        <Button onClick={() => setGoalFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Goals Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-text-tertiary">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              In Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-text-tertiary">Active goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Completion Rate
            </CardTitle>
            <Target className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rate}%</div>
            <p className="text-xs text-text-tertiary">Overall</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Tabs */}
      <div className="flex gap-2 border-b border-border">
        {goalTabs.map((tab) => {
          const count = allGoals.filter((g) => g.type === tab.id).length
          return (
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
              {count > 0 && (
                <span className="ml-1.5 text-xs text-text-tertiary">{count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Goal List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
              <p className="mt-2 text-sm text-text-tertiary">Loading goals...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredGoals.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base capitalize">
              {activeTab.toLowerCase()} Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-surface-elevated p-4 mb-4">
                <Target className="h-8 w-8 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No goals set</h3>
              <p className="text-sm text-text-secondary mb-4 max-w-sm">
                Set goals to track your progress and stay accountable to your
                commitments.
              </p>
              <Button onClick={() => setGoalFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Set a Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base capitalize">
              {activeTab.toLowerCase()} Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredGoals.map((goal) => {
                const isCompleted = !!goal.completedAt
                const hasTarget = goal.targetValue !== null
                const progress = hasTarget
                  ? Math.min(100, Math.round((goal.currentValue / (goal.targetValue || 1)) * 100))
                  : isCompleted
                  ? 100
                  : 0

                return (
                  <div
                    key={goal.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-surface-elevated"
                  >
                    <button
                      onClick={() => toggleGoalCompletion(goal)}
                      className="mt-0.5 transition-colors hover:opacity-80"
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-text-tertiary hover:text-accent" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${isCompleted ? 'line-through text-text-tertiary' : ''}`}>
                        {goal.title}
                      </p>
                      {goal.description && (
                        <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                          {goal.description}
                        </p>
                      )}
                      {hasTarget && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs text-text-secondary">
                            <span>
                              {goal.currentValue} / {goal.targetValue}
                            </span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-surface-elevated">
                            <div
                              className={`h-full rounded-full transition-all ${
                                progress >= 100 ? 'bg-green-400' : 'bg-accent'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-text-secondary">
                          {goal.type}
                        </span>
                        {goal.dueDate && (
                          <span className="text-xs text-text-tertiary">
                            Due: {new Date(goal.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {!isCompleted && progress > 0 && (
                      <TrendingUp className="h-4 w-4 text-green-400 mt-1" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Form Dialog */}
      <GoalFormDialog
        open={goalFormOpen}
        onOpenChange={setGoalFormOpen}
        onSubmit={(data) => createGoal.mutate(data)}
        defaultType={activeTab}
      />
    </div>
  )
}

function GoalFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultType,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { title: string; type: string; targetValue?: number; dueDate?: string; description?: string }) => void
  defaultType: GoalType
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<GoalType>(defaultType)
  const [targetValue, setTargetValue] = useState('')
  const [dueDate, setDueDate] = useState('')

  // Sync default type when dialog opens
  const [lastOpen, setLastOpen] = useState(false)
  if (open && !lastOpen) {
    setType(defaultType)
    setTitle('')
    setDescription('')
    setTargetValue('')
    setDueDate('')
  }
  if (open !== lastOpen) setLastOpen(open)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      title,
      type,
      description: description || undefined,
      targetValue: targetValue ? parseInt(targetValue, 10) : undefined,
      dueDate: dueDate ? new Date(dueDate + 'T00:00:00').toISOString() : undefined,
    })
    setTitle('')
    setDescription('')
    setTargetValue('')
    setDueDate('')
    onOpenChange(false)
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
            <Label htmlFor="goalDescription">Description</Label>
            <textarea
              id="goalDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="w-full min-h-[60px] rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-1">
              {goalTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                    type === t.id
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-border/80'
                  }`}
                >
                  {t.label}
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
          <div className="space-y-2">
            <Label htmlFor="goalDueDate">Due Date (optional)</Label>
            <Input
              id="goalDueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
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
