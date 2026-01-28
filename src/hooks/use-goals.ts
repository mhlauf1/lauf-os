import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Goal } from '@prisma/client'
import type { GoalBreakdown } from '@/lib/utils/goal-cascades'

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

interface GoalsFilter {
  type?: string
  completed?: string
  includeBreakdown?: boolean
}

export type GoalWithCounts = Goal & {
  _count?: { tasks: number; libraryItems: number }
  breakdown?: GoalBreakdown
}

async function fetchGoals(filter: GoalsFilter = {}): Promise<GoalWithCounts[]> {
  const params = new URLSearchParams()
  if (filter.type) params.set('type', filter.type)
  if (filter.completed) params.set('completed', filter.completed)
  if (filter.includeBreakdown) params.set('includeBreakdown', 'true')

  const res = await fetch(`/api/goals?${params.toString()}`)
  const json: ApiResponse<GoalWithCounts[]> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

interface CreateGoalData {
  title: string
  type: string
  description?: string
  targetValue?: number
  startDate?: string
  dueDate?: string
}

async function createGoal(data: CreateGoalData): Promise<Goal> {
  const res = await fetch('/api/goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Goal> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

interface UpdateGoalData {
  id: string
  title?: string
  description?: string | null
  type?: string
  targetValue?: number | null
  currentValue?: number
  startDate?: string | null
  dueDate?: string | null
  completedAt?: string | null
  incrementValue?: number
}

async function updateGoal({ id, ...data }: UpdateGoalData): Promise<Goal> {
  const res = await fetch(`/api/goals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Goal> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function deleteGoal(id: string): Promise<void> {
  const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
}

export function useGoals(filter: GoalsFilter = {}) {
  return useQuery({
    queryKey: ['goals', filter],
    queryFn: () => fetchGoals(filter),
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export function useIncrementGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, incrementValue }: { id: string; incrementValue: number }) =>
      updateGoal({ id, incrementValue }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['library'] })
    },
  })
}
