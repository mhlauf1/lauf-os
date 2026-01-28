import type { GoalType } from '@prisma/client'

interface GoalInput {
  type: GoalType
  targetValue: number | null
  currentValue: number
  startDate: Date | string | null
  dueDate: Date | string | null
}

export interface GoalBreakdown {
  expectedPerWeek: number | null
  expectedPerDay: number | null
  expectedByNow: number | null
  isOnTrack: boolean
  progressPercent: number
}

function toDate(d: Date | string | null): Date | null {
  if (!d) return null
  return typeof d === 'string' ? new Date(d) : d
}

function daysBetween(a: Date, b: Date): number {
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)))
}

function daysSince(start: Date): number {
  return Math.max(0, Math.round((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)))
}

export function computeBreakdown(goal: GoalInput): GoalBreakdown {
  const target = goal.targetValue
  if (!target || target <= 0) {
    return {
      expectedPerWeek: null,
      expectedPerDay: null,
      expectedByNow: null,
      isOnTrack: goal.currentValue > 0,
      progressPercent: 0,
    }
  }

  const progressPercent = Math.min(100, Math.round((goal.currentValue / target) * 100))

  const start = toDate(goal.startDate)
  const due = toDate(goal.dueDate)

  // Compute total period in days
  let totalDays: number
  if (start && due) {
    totalDays = daysBetween(start, due)
  } else {
    // Fallback based on goal type
    switch (goal.type) {
      case 'DAILY':
        totalDays = 1
        break
      case 'WEEKLY':
        totalDays = 7
        break
      case 'MONTHLY':
        totalDays = 30
        break
      case 'YEARLY':
        totalDays = 365
        break
      default:
        totalDays = 30
    }
  }

  const expectedPerDay = target / totalDays
  const expectedPerWeek = totalDays >= 7 ? target / (totalDays / 7) : null

  // Compute expectedByNow based on elapsed days
  let expectedByNow: number | null = null
  if (start) {
    const elapsed = daysSince(start)
    expectedByNow = Math.min(target, Math.round(expectedPerDay * elapsed))
  }

  const isOnTrack = expectedByNow !== null
    ? goal.currentValue >= expectedByNow
    : progressPercent >= 50

  return {
    expectedPerWeek: expectedPerWeek !== null ? Math.round(expectedPerWeek * 10) / 10 : null,
    expectedPerDay: Math.round(expectedPerDay * 10) / 10,
    expectedByNow,
    isOnTrack,
    progressPercent,
  }
}
