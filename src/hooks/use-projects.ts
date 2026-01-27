import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Project } from '@prisma/client'

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

interface ProjectsFilter {
  status?: string
  clientId?: string
}

async function fetchProjects(filter: ProjectsFilter = {}): Promise<Project[]> {
  const params = new URLSearchParams()
  if (filter.status) params.set('status', filter.status)
  if (filter.clientId) params.set('clientId', filter.clientId)

  const res = await fetch(`/api/projects?${params.toString()}`)
  const json: ApiResponse<Project[]> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function fetchProject(id: string): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`)
  const json: ApiResponse<Project> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

interface CreateProjectData {
  clientId: string
  name: string
  description?: string
  type?: string
  priority?: string
  startDate?: string
  dueDate?: string
  budget?: number
  repositoryUrl?: string
  stagingUrl?: string
  productionUrl?: string
}

async function createProject(data: CreateProjectData): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Project> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

interface UpdateProjectData {
  id: string
  name?: string
  description?: string | null
  type?: string
  status?: string
  priority?: string
  startDate?: string | null
  dueDate?: string | null
  budget?: number | null
  repositoryUrl?: string | null
  stagingUrl?: string | null
  productionUrl?: string | null
}

async function updateProject({ id, ...data }: UpdateProjectData): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Project> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
}

export function useProjects(filter: ProjectsFilter = {}) {
  return useQuery({
    queryKey: ['projects', filter],
    queryFn: () => fetchProjects(filter),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
