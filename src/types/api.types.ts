/**
 * Standard API response format used across all endpoints
 */
export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  message?: string
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
