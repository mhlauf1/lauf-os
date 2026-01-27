import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Client } from '@prisma/client'

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

interface ClientsFilter {
  status?: string
  healthScore?: string
  search?: string
}

async function fetchClients(filter: ClientsFilter = {}): Promise<Client[]> {
  const params = new URLSearchParams()
  if (filter.status) params.set('status', filter.status)
  if (filter.healthScore) params.set('healthScore', filter.healthScore)
  if (filter.search) params.set('search', filter.search)

  const res = await fetch(`/api/clients?${params.toString()}`)
  const json: ApiResponse<Client[]> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function fetchClient(id: string): Promise<Client> {
  const res = await fetch(`/api/clients/${id}`)
  const json: ApiResponse<Client> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

interface CreateClientData {
  name: string
  email?: string
  phone?: string
  company?: string
  industry?: string
  websiteUrl?: string
  githubUrl?: string
  vercelUrl?: string
  figmaUrl?: string
  contractValue?: number
  monthlyRetainer?: number
  referredBy?: string
  notes?: string
}

async function createClient(data: CreateClientData): Promise<Client> {
  const res = await fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Client> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

interface UpdateClientData {
  id: string
  name?: string
  email?: string | null
  phone?: string | null
  company?: string | null
  industry?: string | null
  status?: string
  healthScore?: string
  websiteUrl?: string | null
  githubUrl?: string | null
  vercelUrl?: string | null
  figmaUrl?: string | null
  contractValue?: number | null
  monthlyRetainer?: number | null
  referredBy?: string | null
  notes?: string | null
}

async function updateClient({ id, ...data }: UpdateClientData): Promise<Client> {
  const res = await fetch(`/api/clients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Client> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function deleteClient(id: string): Promise<void> {
  const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
}

export function useClients(filter: ClientsFilter = {}) {
  return useQuery({
    queryKey: ['clients', filter],
    queryFn: () => fetchClients(filter),
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => fetchClient(id),
    enabled: !!id,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
