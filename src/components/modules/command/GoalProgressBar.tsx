'use client'

import { cn } from '@/lib/utils'

interface GoalProgressBarProps {
  current: number
  target: number
  expectedByNow?: number | null
  size?: 'sm' | 'md'
  isOnTrack?: boolean
}

export function GoalProgressBar({
  current,
  target,
  expectedByNow,
  size = 'md',
  isOnTrack,
}: GoalProgressBarProps) {
  const percent = Math.min(100, Math.round((current / Math.max(1, target)) * 100))
  const expectedPercent =
    expectedByNow !== null && expectedByNow !== undefined
      ? Math.min(100, Math.round((expectedByNow / Math.max(1, target)) * 100))
      : null

  // Determine color: green if on track / completed, amber if slightly behind, red if far behind
  let barColor = 'bg-accent'
  if (percent >= 100) {
    barColor = 'bg-green-400'
  } else if (isOnTrack === true) {
    barColor = 'bg-green-400'
  } else if (isOnTrack === false) {
    // Behind: amber if within 20%, red if further behind
    if (expectedPercent !== null && percent >= expectedPercent - 20) {
      barColor = 'bg-amber-400'
    } else {
      barColor = 'bg-red-400'
    }
  }

  const heightClass = size === 'sm' ? 'h-1' : 'h-1.5'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>
          {current} / {target}
        </span>
        <span>{percent}%</span>
      </div>
      <div className={cn('relative rounded-full bg-surface-elevated', heightClass)}>
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${percent}%` }}
        />
        {expectedPercent !== null && expectedPercent > 0 && percent < 100 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-text-tertiary/50"
            style={{ left: `${expectedPercent}%` }}
            title={`Expected: ${expectedByNow}`}
          />
        )}
      </div>
    </div>
  )
}
