'use client'

import { Target, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GoalProgressBar } from './GoalProgressBar'
import type { GoalWithCounts } from '@/hooks/use-goals'
import type { GoalBreakdown } from '@/lib/utils/goal-cascades'
import { computeBreakdown } from '@/lib/utils/goal-cascades'

interface GoalsPanelProps {
  goals: GoalWithCounts[]
  onGoalClick?: (id: string) => void
  onAddGoal?: () => void
  onIncrement?: (id: string, value: number) => void
}

const typeLabels: Record<string, string> = {
  DAILY: 'D',
  WEEKLY: 'W',
  MONTHLY: 'M',
  YEARLY: 'Y',
}

const typeBgColors: Record<string, string> = {
  DAILY: 'bg-blue-500/10 text-blue-400',
  WEEKLY: 'bg-violet-500/10 text-violet-400',
  MONTHLY: 'bg-amber-500/10 text-amber-400',
  YEARLY: 'bg-green-500/10 text-green-400',
}

function getBreakdown(goal: GoalWithCounts): GoalBreakdown | undefined {
  if (goal.breakdown) return goal.breakdown
  if (!goal.targetValue) return undefined
  return computeBreakdown({
    type: goal.type,
    targetValue: goal.targetValue,
    currentValue: goal.currentValue,
    startDate: goal.startDate,
    dueDate: goal.dueDate,
  })
}

export function GoalsPanelContent({
  goals,
  onGoalClick,
  onAddGoal,
  onIncrement,
}: GoalsPanelProps) {
  // Show all incomplete goals, sorted by most behind pace first
  const incompleteGoals = goals
    .filter((g) => !g.completedAt)
    .sort((a, b) => {
      const breakdownA = getBreakdown(a)
      const breakdownB = getBreakdown(b)
      // Goals that are behind come first
      if (breakdownA?.isOnTrack === false && breakdownB?.isOnTrack !== false) return -1
      if (breakdownA?.isOnTrack !== false && breakdownB?.isOnTrack === false) return 1
      // Then by progress percent ascending
      const pctA = breakdownA?.progressPercent ?? 0
      const pctB = breakdownB?.progressPercent ?? 0
      return pctA - pctB
    })

  const totalCount = goals.filter((g) => !g.completedAt).length
  const onTrackCount = incompleteGoals.filter((g) => getBreakdown(g)?.isOnTrack).length

  return (
    <div className="space-y-3">
      {/* Top row: summary + Add */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">
          {totalCount} active
          {totalCount > 0 && ` · ${onTrackCount} on track`}
        </span>
        <button
          onClick={onAddGoal}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      {/* Unified goals list */}
      <div className="space-y-2">
        {incompleteGoals.length === 0 ? (
          <p className="text-xs text-text-tertiary py-1">No active goals</p>
        ) : (
          incompleteGoals.map((goal) => {
            const breakdown = getBreakdown(goal)
            const hasTarget = goal.targetValue !== null && goal.targetValue > 0

            return (
              <CompactGoalRow
                key={goal.id}
                goal={goal}
                breakdown={breakdown}
                hasTarget={hasTarget}
                onClick={() => onGoalClick?.(goal.id)}
                onIncrement={onIncrement}
              />
            )
          })
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

interface CompactGoalRowProps {
  goal: GoalWithCounts
  breakdown?: GoalBreakdown
  hasTarget: boolean
  onClick?: () => void
  onIncrement?: (id: string, value: number) => void
}

function CompactGoalRow({ goal, breakdown, hasTarget, onClick, onIncrement }: CompactGoalRowProps) {
  return (
    <div className="rounded-md border border-border p-2.5 hover:bg-surface-elevated transition-colors">
      <div className="flex items-center gap-2">
        {/* On-track dot */}
        {hasTarget && breakdown && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full shrink-0',
              breakdown.isOnTrack ? 'bg-green-400' : 'bg-amber-400'
            )}
          />
        )}

        {/* Title */}
        <button onClick={onClick} className="flex-1 text-left text-xs font-medium truncate">
          {goal.title}
        </button>

        {/* Type badge */}
        <span
          className={cn(
            'text-[9px] font-bold px-1 py-0 rounded shrink-0',
            typeBgColors[goal.type]
          )}
        >
          {typeLabels[goal.type]}
        </span>

        {/* Quick +1 button */}
        {hasTarget && (
          <button
            onClick={() => onIncrement?.(goal.id, 1)}
            className="rounded px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors shrink-0"
          >
            +1
          </button>
        )}
      </div>

      {/* Small progress bar */}
      {hasTarget && (
        <div className="mt-1.5">
          <GoalProgressBar
            current={goal.currentValue}
            target={goal.targetValue!}
            expectedByNow={breakdown?.expectedByNow}
            size="sm"
            isOnTrack={breakdown?.isOnTrack}
          />
        </div>
      )}
    </div>
  )
}
