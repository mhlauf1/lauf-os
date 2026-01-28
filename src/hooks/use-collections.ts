import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Collection, CollectionItem, LibraryItem } from '@prisma/client'

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface CollectionWithCount extends Collection {
  _count: { items: number }
}

export interface CollectionWithItems extends Collection {
  items: (CollectionItem & { libraryItem: LibraryItem })[]
  _count: { items: number }
}

interface CollectionFilter {
  search?: string
}

async function fetchCollections(filter: CollectionFilter = {}): Promise<CollectionWithCount[]> {
  const params = new URLSearchParams()
  if (filter.search) params.set('search', filter.search)

  const res = await fetch(`/api/collections?${params.toString()}`)
  const json: ApiResponse<CollectionWithCount[]> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function fetchCollection(id: string): Promise<CollectionWithItems> {
  const res = await fetch(`/api/collections/${id}`)
  const json: ApiResponse<CollectionWithItems> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

export interface CreateCollectionData {
  name: string
  description?: string
  color?: string
  icon?: string
  sortOrder?: number
}

async function createCollection(data: CreateCollectionData): Promise<CollectionWithCount> {
  const res = await fetch('/api/collections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<CollectionWithCount> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

export interface UpdateCollectionData {
  id: string
  name?: string
  description?: string | null
  color?: string | null
  icon?: string | null
  sortOrder?: number
}

async function updateCollection({ id, ...data }: UpdateCollectionData): Promise<CollectionWithCount> {
  const res = await fetch(`/api/collections/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<CollectionWithCount> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function deleteCollection(id: string): Promise<void> {
  const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
}

export interface AddCollectionItemData {
  collectionId: string
  libraryItemId: string
  sortOrder?: number
}

async function addCollectionItem({ collectionId, ...data }: AddCollectionItemData): Promise<CollectionItem & { libraryItem: LibraryItem }> {
  const res = await fetch(`/api/collections/${collectionId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<CollectionItem & { libraryItem: LibraryItem }> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

export interface RemoveCollectionItemData {
  collectionId: string
  libraryItemId: string
}

async function removeCollectionItem({ collectionId, libraryItemId }: RemoveCollectionItemData): Promise<void> {
  const res = await fetch(`/api/collections/${collectionId}/items`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ libraryItemId }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
}

export function useCollections(filter: CollectionFilter = {}) {
  return useQuery({
    queryKey: ['collections', filter],
    queryFn: () => fetchCollections(filter),
  })
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: ['collections', id],
    queryFn: () => fetchCollection(id),
    enabled: !!id,
  })
}

export function useCreateCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useUpdateCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useAddCollectionItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addCollectionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useRemoveCollectionItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeCollectionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
