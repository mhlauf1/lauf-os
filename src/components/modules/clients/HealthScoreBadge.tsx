'use client'

import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import type { HealthScore } from '@prisma/client'

interface HealthScoreBadgeProps {
  score: HealthScore
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const healthConfig: Record<
  HealthScore,
  {
    label: string
    color: string
    bgColor: string
    borderColor: string
    icon: typeof CheckCircle
  }
> = {
  GREEN: {
    label: 'Healthy',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-400',
    icon: CheckCircle,
  },
  YELLOW: {
    label: 'Needs Attention',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-400',
    icon: AlertCircle,
  },
  RED: {
    label: 'At Risk',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-400',
    icon: XCircle,
  },
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const badgeSizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
}

export function HealthScoreBadge({
  score,
  showLabel = true,
  size = 'md',
}: HealthScoreBadgeProps) {
  const config = healthConfig[score]
  const Icon = config.icon

  if (!showLabel) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full',
          config.bgColor,
          size === 'sm' && 'h-5 w-5',
          size === 'md' && 'h-6 w-6',
          size === 'lg' && 'h-8 w-8'
        )}
      >
        <Icon className={cn(sizeClasses[size], config.color)} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border',
        config.bgColor,
        config.borderColor,
        badgeSizeClasses[size]
      )}
    >
      <Icon className={cn(sizeClasses[size], config.color)} />
      <span className={cn('font-medium', config.color)}>{config.label}</span>
    </div>
  )
}
