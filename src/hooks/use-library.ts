import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { LibraryItem } from '@prisma/client'

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

interface LibraryFilter {
  type?: string
  search?: string
  tag?: string
  showcased?: boolean
  forSale?: boolean
}

async function fetchLibraryItems(filter: LibraryFilter = {}): Promise<LibraryItem[]> {
  const params = new URLSearchParams()
  if (filter.type) params.set('type', filter.type)
  if (filter.search) params.set('search', filter.search)
  if (filter.tag) params.set('tag', filter.tag)
  if (filter.showcased !== undefined) params.set('showcased', String(filter.showcased))
  if (filter.forSale !== undefined) params.set('forSale', String(filter.forSale))

  const res = await fetch(`/api/library?${params.toString()}`)
  const json: ApiResponse<LibraryItem[]> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function fetchLibraryItem(id: string): Promise<LibraryItem> {
  const res = await fetch(`/api/library/${id}`)
  const json: ApiResponse<LibraryItem> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

export interface CreateLibraryItemData {
  type: string
  title: string
  description?: string
  sourceUrl?: string
  figmaUrl?: string
  githubUrl?: string
  prompt?: string
  aiTool?: string
  techStack?: string[]
  tags?: string[]
  isShowcased?: boolean
  isForSale?: boolean
  price?: number
  goalId?: string
}

async function createLibraryItem(data: CreateLibraryItemData): Promise<LibraryItem> {
  const res = await fetch('/api/library', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<LibraryItem> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

export interface UpdateLibraryItemData {
  id: string
  type?: string
  title?: string
  description?: string | null
  sourceUrl?: string | null
  figmaUrl?: string | null
  githubUrl?: string | null
  prompt?: string | null
  aiTool?: string | null
  techStack?: string[]
  tags?: string[]
  isShowcased?: boolean
  isForSale?: boolean
  price?: number | null
  goalId?: string | null
}

async function updateLibraryItem({ id, ...data }: UpdateLibraryItemData): Promise<LibraryItem> {
  const res = await fetch(`/api/library/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<LibraryItem> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function deleteLibraryItem(id: string): Promise<void> {
  const res = await fetch(`/api/library/${id}`, { method: 'DELETE' })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
}

export function useLibrary(filter: LibraryFilter = {}) {
  return useQuery({
    queryKey: ['library', filter],
    queryFn: () => fetchLibraryItems(filter),
  })
}

export function useLibraryItem(id: string) {
  return useQuery({
    queryKey: ['library', id],
    queryFn: () => fetchLibraryItem(id),
    enabled: !!id,
  })
}

export function useCreateLibraryItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createLibraryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export function useUpdateLibraryItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateLibraryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export function useDeleteLibraryItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteLibraryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}
