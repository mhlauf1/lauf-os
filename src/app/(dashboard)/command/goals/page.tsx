'use client'

import { useState, useMemo } from 'react'
import { Plus, Target, TrendingUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GoalCard, GoalFormDialog } from '@/components/modules/command'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import {
  useGoals,
  useCreateGoal,
  useIncrementGoal,
  useDeleteGoal,
  type GoalWithCounts,
} from '@/hooks/use-goals'
import { computeBreakdown } from '@/lib/utils/goal-cascades'

type Perspective = 'month' | 'week' | 'day'

const perspectives: { id: Perspective; label: string }[] = [
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'day', label: 'Day' },
]

export default function GoalsPage() {
  const [perspective, setPerspective] = useState<Perspective>('month')
  const [goalFormOpen, setGoalFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null)

  const { data: allGoals = [], isLoading } = useGoals({ includeBreakdown: true })
  const createGoal = useCreateGoal()
  const incrementGoal = useIncrementGoal()
  const deleteGoal = useDeleteGoal()

  // Compute breakdowns for goals that don't have them from the API
  const goalsWithBreakdowns = useMemo(
    () =>
      allGoals.map((goal) => ({
        ...goal,
        breakdown:
          goal.breakdown ||
          (goal.targetValue
            ? computeBreakdown({
                type: goal.type,
                targetValue: goal.targetValue,
                currentValue: goal.currentValue,
                startDate: goal.startDate,
                dueDate: goal.dueDate,
              })
            : undefined),
      })),
    [allGoals]
  )

  const stats = useMemo(() => {
    const total = allGoals.length
    const completed = allGoals.filter((g) => g.completedAt).length
    const active = total - completed
    const onTrack = goalsWithBreakdowns.filter(
      (g) => !g.completedAt && g.breakdown?.isOnTrack
    ).length
    const behind = active - onTrack
    return { total, completed, active, onTrack, behind }
  }, [allGoals, goalsWithBreakdowns])

  function handleIncrement(id: string, value: number) {
    incrementGoal.mutate(
      { id, incrementValue: value },
      {
        onSuccess: () => toast.success(value > 0 ? 'Progress updated' : 'Progress decremented'),
        onError: (err) => toast.error(err.message || 'Failed to update progress'),
      }
    )
  }

  function handleDeleteGoal(id: string) {
    setDeletingGoalId(id)
    setDeleteDialogOpen(true)
  }

  function confirmDelete() {
    if (!deletingGoalId) return
    deleteGoal.mutate(deletingGoalId, {
      onSuccess: () => {
        toast.success('Goal deleted')
        setDeleteDialogOpen(false)
        setDeletingGoalId(null)
      },
      onError: (err) => toast.error(err.message || 'Failed to delete goal'),
    })
  }

  // Filter & group goals by perspective
  const { primaryGoals, secondaryGoals } = useMemo(() => {
    const incomplete = goalsWithBreakdowns.filter((g) => !g.completedAt)
    const completed = goalsWithBreakdowns.filter((g) => g.completedAt)

    let primary: GoalWithCounts[] = []
    let secondary: GoalWithCounts[] = []

    switch (perspective) {
      case 'month':
        primary = incomplete.filter((g) => g.type === 'MONTHLY' || g.type === 'YEARLY')
        secondary = incomplete.filter((g) => g.type === 'WEEKLY' || g.type === 'DAILY')
        break
      case 'week':
        primary = incomplete.filter(
          (g) => g.type === 'MONTHLY' || g.type === 'WEEKLY'
        )
        secondary = incomplete.filter((g) => g.type === 'DAILY')
        break
      case 'day':
        primary = incomplete
        secondary = []
        break
    }

    return {
      primaryGoals: primary,
      secondaryGoals: secondary,
      completedGoals: completed,
    }
  }, [goalsWithBreakdowns, perspective])

  function getPerspectiveLabel(): string {
    switch (perspective) {
      case 'month':
        return 'Monthly Goals'
      case 'week':
        return 'This Week'
      case 'day':
        return "Today's Goals"
    }
  }

  function getSecondaryLabel(): string {
    switch (perspective) {
      case 'month':
        return 'Weekly & Daily Goals'
      case 'week':
        return 'Daily Goals'
      case 'day':
        return ''
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Total Goals
            </CardTitle>
            <Target className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              On Track
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onTrack}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Behind
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.behind}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Perspective Toggle */}
      <div className="flex gap-1 rounded-lg bg-surface-elevated p-1 w-fit">
        {perspectives.map((p) => (
          <button
            key={p.id}
            onClick={() => setPerspective(p.id)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              perspective === p.id
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Goal Cards */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
              <p className="mt-2 text-sm text-text-tertiary">Loading goals...</p>
            </div>
          </CardContent>
        </Card>
      ) : primaryGoals.length === 0 && secondaryGoals.length === 0 ? (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-surface-elevated p-4 mb-4">
                <Target className="h-8 w-8 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No active goals</h3>
              <p className="text-sm text-text-secondary mb-4 max-w-sm">
                Set goals to track your progress and stay accountable.
              </p>
              <Button onClick={() => setGoalFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Set a Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Primary goals */}
          {primaryGoals.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-text-secondary mb-3">
                {getPerspectiveLabel()}
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {primaryGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    breakdown={goal.breakdown}
                    onIncrement={handleIncrement}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Secondary goals */}
          {secondaryGoals.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-text-secondary mb-3">
                {getSecondaryLabel()}
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {secondaryGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    breakdown={goal.breakdown}
                    onIncrement={handleIncrement}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete goal?"
        description="This will permanently delete this goal. Tasks and library items linked to it will be unlinked."
        isPending={deleteGoal.isPending}
      />
    </div>
  )
}
