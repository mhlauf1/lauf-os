import type { PillarId } from '@/config/pillars'
import type { Status } from '@/config/site'

/**
 * Content idea as stored in the database
 */
export interface Idea {
  id: string
  user_id: string
  title: string
  body: string | null
  pillar: PillarId
  status: Status
  media_urls: string[]
  scheduled_for: string | null
  posted_at: string | null
  x_post_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

/**
 * Input for creating a new idea
 */
export interface CreateIdeaInput {
  title: string
  body?: string
  pillar: PillarId
  status?: Status
  media_urls?: string[]
  scheduled_for?: string
}

/**
 * Input for updating an existing idea
 */
export interface UpdateIdeaInput {
  title?: string
  body?: string
  pillar?: PillarId
  status?: Status
  media_urls?: string[]
  scheduled_for?: string
  sort_order?: number
}

/**
 * Filters for querying ideas
 */
export interface IdeaFilters {
  pillar?: PillarId
  status?: Status
  search?: string
}
