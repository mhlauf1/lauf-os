import { useQuery } from '@tanstack/react-query'
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

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  })
}
