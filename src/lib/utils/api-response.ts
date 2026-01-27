import { NextResponse } from 'next/server'

/**
 * Standard API response format used across all endpoints
 */
export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  message?: string
}

/**
 * Creates a consistent API response with proper status codes
 *
 * @example
 * // Success response
 * return apiResponse({ data: ideas })
 *
 * // Error response
 * return apiResponse({ error: 'Not found' }, 404)
 *
 * // Success with message
 * return apiResponse({ data: idea, message: 'Idea created' }, 201)
 */
export function apiResponse<T>(
  body: Partial<ApiResponse<T>>,
  status = 200
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    data: body.data ?? null,
    error: body.error ?? null,
    message: body.message,
  }

  return NextResponse.json(response, { status })
}

/**
 * Common error responses
 */
export const ApiErrors = {
  unauthorized: () => apiResponse({ error: 'Unauthorized' }, 401),
  forbidden: () => apiResponse({ error: 'Forbidden' }, 403),
  notFound: (resource = 'Resource') =>
    apiResponse({ error: `${resource} not found` }, 404),
  badRequest: (message: string) => apiResponse({ error: message }, 400),
  internal: (message = 'Internal server error') =>
    apiResponse({ error: message }, 500),
} as const
