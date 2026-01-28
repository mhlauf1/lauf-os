import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TweetDraft } from '@prisma/client'

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

interface TweetDraftFilter {
  status?: string
  search?: string
  tag?: string
}

async function fetchTweetDrafts(filter: TweetDraftFilter = {}): Promise<TweetDraft[]> {
  const params = new URLSearchParams()
  if (filter.status) params.set('status', filter.status)
  if (filter.search) params.set('search', filter.search)
  if (filter.tag) params.set('tag', filter.tag)

  const res = await fetch(`/api/tweets?${params.toString()}`)
  const json: ApiResponse<TweetDraft[]> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function fetchTweetDraft(id: string): Promise<TweetDraft> {
  const res = await fetch(`/api/tweets/${id}`)
  const json: ApiResponse<TweetDraft> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

export interface CreateTweetDraftData {
  content: string
  tweetNumber?: number
  totalTweets?: number
  status?: string
  tags?: string[]
}

async function createTweetDraft(data: CreateTweetDraftData): Promise<TweetDraft> {
  const res = await fetch('/api/tweets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<TweetDraft> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

export interface UpdateTweetDraftData {
  id: string
  content?: string
  tweetNumber?: number
  totalTweets?: number
  status?: string
  tags?: string[]
  postedAt?: string | null
}

async function updateTweetDraft({ id, ...data }: UpdateTweetDraftData): Promise<TweetDraft> {
  const res = await fetch(`/api/tweets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<TweetDraft> = await res.json()
  if (json.error || !json.data) throw new Error(json.error || 'Unknown error')
  return json.data
}

async function deleteTweetDraft(id: string): Promise<void> {
  const res = await fetch(`/api/tweets/${id}`, { method: 'DELETE' })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
}

export function useTweetDrafts(filter: TweetDraftFilter = {}) {
  return useQuery({
    queryKey: ['tweetDrafts', filter],
    queryFn: () => fetchTweetDrafts(filter),
  })
}

export function useTweetDraft(id: string) {
  return useQuery({
    queryKey: ['tweetDrafts', id],
    queryFn: () => fetchTweetDraft(id),
    enabled: !!id,
  })
}

export function useCreateTweetDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTweetDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tweetDrafts'] })
    },
  })
}

export function useUpdateTweetDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTweetDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tweetDrafts'] })
    },
  })
}

export function useDeleteTweetDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTweetDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tweetDrafts'] })
    },
  })
}
