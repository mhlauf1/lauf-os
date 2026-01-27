'use client'

import { Target, TrendingUp, CheckCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Goal, GoalType } from '@prisma/client'

interface GoalsPanelProps {
  goals: Goal[]
  activeType?: GoalType
  onTypeChange?: (type: GoalType) => void
  onGoalClick?: (id: string) => void
  onAddGoal?: () => void
}

const goalTypes: { value: GoalType; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
]

export function GoalsPanel({
  goals,
  activeType = 'WEEKLY',
  onTypeChange,
  onGoalClick,
  onAddGoal,
}: GoalsPanelProps) {
  const filteredGoals = goals.filter((g) => g.type === activeType)
  const completedCount = filteredGoals.filter((g) => g.completedAt).length
  const totalCount = filteredGoals.length
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-text-tertiary" />
            <CardTitle className="text-base">Goals</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onAddGoal}>
            + Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type Tabs */}
        <div className="flex gap-1 rounded-lg bg-surface-elevated p-1">
          {goalTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onTypeChange?.(type.value)}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                activeType === type.value
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Progress</span>
            <span className="font-medium">
              {completedCount} / {totalCount}
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-elevated">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-2">
          {filteredGoals.length === 0 ? (
            <p className="text-center text-sm text-text-tertiary py-4">
              No {activeType.toLowerCase()} goals set
            </p>
          ) : (
            filteredGoals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onClick={() => onGoalClick?.(goal.id)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface GoalItemProps {
  goal: Goal
  onClick?: () => void
}

function GoalItem({ goal, onClick }: GoalItemProps) {
  const isCompleted = !!goal.completedAt
  const hasTarget = goal.targetValue !== null
  const progress = hasTarget
    ? Math.min(
        100,
        Math.round((goal.currentValue / (goal.targetValue || 1)) * 100)
      )
    : isCompleted
    ? 100
    : 0

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border border-border p-3 text-left transition-colors',
        'hover:border-border/80 hover:bg-surface-elevated',
        isCompleted && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        {isCompleted ? (
          <CheckCircle className="h-4 w-4 mt-0.5 text-green-400" />
        ) : (
          <Circle className="h-4 w-4 mt-0.5 text-text-tertiary" />
        )}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'font-medium text-sm',
              isCompleted && 'line-through text-text-tertiary'
            )}
          >
            {goal.title}
          </p>
          {hasTarget && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>
                  {goal.currentValue} / {goal.targetValue}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 rounded-full bg-surface-elevated">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    progress >= 100 ? 'bg-green-400' : 'bg-accent'
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {!isCompleted && progress > 0 && (
          <TrendingUp className="h-4 w-4 text-green-400" />
        )}
      </div>
    </button>
  )
}
