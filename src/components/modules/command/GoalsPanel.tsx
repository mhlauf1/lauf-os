'use client'

import { Target, CheckCircle, Circle, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Goal, GoalType } from '@prisma/client'

interface GoalsPanelProps {
  goals: Goal[]
  activeType?: GoalType
  onTypeChange?: (type: GoalType) => void
  onGoalClick?: (id: string) => void
  onAddGoal?: () => void
  onToggleComplete?: (id: string, completed: boolean) => void
}

const goalTypes: { value: GoalType; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
]

export function GoalsPanelContent({
  goals,
  activeType = 'WEEKLY',
  onTypeChange,
  onGoalClick,
  onAddGoal,
  onToggleComplete,
}: GoalsPanelProps) {
  const filteredGoals = goals.filter((g) => g.type === activeType)
  const completedCount = filteredGoals.filter((g) => g.completedAt).length
  const totalCount = filteredGoals.length
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-3">
      {/* Top row: Tabs + Add */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-md bg-surface-elevated p-0.5">
          {goalTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onTypeChange?.(type.value)}
              className={cn(
                'rounded px-2 py-1 text-xs font-medium transition-colors',
                activeType === type.value
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
        <button
          onClick={onAddGoal}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-text-secondary whitespace-nowrap">
          {completedCount}/{totalCount}
        </span>
        <div className="h-1.5 flex-1 rounded-full bg-surface-elevated">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-xs text-text-tertiary">{progressPercentage}%</span>
      </div>

      {/* Goals List — compact inline items */}
      <div className="flex flex-wrap gap-2">
        {filteredGoals.length === 0 ? (
          <p className="text-xs text-text-tertiary py-1">
            No {activeType.toLowerCase()} goals set
          </p>
        ) : (
          filteredGoals.map((goal) => (
            <CompactGoalItem
              key={goal.id}
              goal={goal}
              onClick={() => onGoalClick?.(goal.id)}
              onToggleComplete={onToggleComplete}
            />
          ))
        )}
      </div>
    </div>
  )
}

export function GoalsPanel(props: GoalsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-text-tertiary" />
          <CardTitle className="text-base">Goals</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <GoalsPanelContent {...props} />
      </CardContent>
    </Card>
  )
}

interface GoalItemProps {
  goal: Goal
  onClick?: () => void
  onToggleComplete?: (id: string, completed: boolean) => void
}

function CompactGoalItem({ goal, onClick, onToggleComplete }: GoalItemProps) {
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
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs transition-colors',
        'hover:border-border/80 hover:bg-surface-elevated',
        isCompleted && 'opacity-50'
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleComplete?.(goal.id, !isCompleted)
        }}
        className="transition-colors hover:opacity-80"
      >
        {isCompleted ? (
          <CheckCircle className="h-3.5 w-3.5 text-green-400" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-text-tertiary hover:text-accent" />
        )}
      </button>
      <button onClick={onClick} className="text-left">
        <span
          className={cn(
            'font-medium',
            isCompleted && 'line-through text-text-tertiary'
          )}
        >
          {goal.title}
        </span>
      </button>
      {hasTarget && (
        <span className="text-text-tertiary ml-1">
          {goal.currentValue}/{goal.targetValue}
        </span>
      )}
    </div>
  )
}
