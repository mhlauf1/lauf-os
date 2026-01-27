import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Goal } from '@prisma/client'

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

interface GoalsFilter {
  type?: string
  completed?: string
}

async function fetchGoals(filter: GoalsFilter = {}): Promise<Goal[]> {
  const params = new URLSearchParams()
  if (filter.type) params.set('type', filter.type)
  if (filter.completed) params.set('completed', filter.completed)

  const res = await fetch(`/api/goals?${params.toString()}`)
  const json: ApiResponse<Goal[]> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

interface CreateGoalData {
  title: string
  type: string
  description?: string
  targetValue?: number
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
  dueDate?: string | null
  completedAt?: string | null
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
