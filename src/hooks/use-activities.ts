import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Activity } from '@prisma/client'

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

async function fetchActivities(): Promise<Activity[]> {
  const res = await fetch('/api/activities')
  const json: ApiResponse<Activity[]> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function createActivity(
  data: Pick<Activity, 'title' | 'category'> &
    Partial<Pick<Activity, 'description' | 'defaultDuration' | 'energyLevel' | 'icon' | 'sortOrder'>>
): Promise<Activity> {
  const res = await fetch('/api/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Activity> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function updateActivity({
  id,
  ...data
}: { id: string } & Partial<
  Pick<
    Activity,
    | 'title'
    | 'description'
    | 'category'
    | 'defaultDuration'
    | 'energyLevel'
    | 'icon'
    | 'isActive'
    | 'sortOrder'
  >
>): Promise<Activity> {
  const res = await fetch(`/api/activities/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Activity> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function deleteActivity(id: string): Promise<void> {
  const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
}

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

export function useUpdateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

export function useDeleteActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}
