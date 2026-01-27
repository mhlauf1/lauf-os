import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task } from '@prisma/client'

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

interface TasksFilter {
  date?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  category?: string
}

async function fetchTasks(filter: TasksFilter = {}): Promise<Task[]> {
  const params = new URLSearchParams()
  if (filter.date) params.set('date', filter.date)
  if (filter.dateFrom) params.set('dateFrom', filter.dateFrom)
  if (filter.dateTo) params.set('dateTo', filter.dateTo)
  if (filter.status) params.set('status', filter.status)
  if (filter.category) params.set('category', filter.category)

  const res = await fetch(`/api/tasks?${params.toString()}`)
  const json: ApiResponse<Task[]> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

interface CreateTaskData {
  title: string
  category: string
  description?: string
  priority?: string
  status?: string
  scheduledDate?: string
  scheduledTime?: string
  timeBlockMinutes?: number
  energyLevel?: string
  projectId?: string
  activityId?: string
  goalId?: string
}

async function createTask(data: CreateTaskData): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Task> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

interface UpdateTaskData {
  id: string
  title?: string
  description?: string | null
  category?: string
  priority?: string
  status?: string
  scheduledDate?: string | null
  scheduledTime?: string | null
  timeBlockMinutes?: number
  energyLevel?: string
  projectId?: string | null
  activityId?: string | null
  goalId?: string | null
}

async function updateTask({ id, ...data }: UpdateTaskData): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Task> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
}

export function useTasks(filter: TasksFilter = {}) {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => fetchTasks(filter),
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}
