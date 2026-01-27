/**
 * Application-wide constants
 */

// Character limits
export const MAX_POST_CHARS = 280
export const MAX_TITLE_CHARS = 500
export const MAX_BODY_CHARS = 10000

// Time slots for scheduling (24-hour format)
export const TIME_SLOTS = {
  morning: { label: 'Morning', time: '09:00', hour: 9 },
  afternoon: { label: 'Afternoon', time: '14:00', hour: 14 },
  evening: { label: 'Evening', time: '19:00', hour: 19 },
} as const

// API endpoints
export const API_ENDPOINTS = {
  ideas: '/api/ideas',
  x: {
    auth: '/api/x/auth',
    callback: '/api/x/callback',
    post: '/api/x/post',
    metrics: '/api/x/metrics',
  },
  ai: {
    summarize: '/api/ai/summarize',
  },
  cron: {
    postScheduled: '/api/cron/post-scheduled',
  },
} as const

// Local storage keys
export const STORAGE_KEYS = {
  draftPost: 'lauf-os-draft-post',
  uiPreferences: 'lauf-os-ui-prefs',
} as const

// Query keys for React Query
export const QUERY_KEYS = {
  ideas: 'ideas',
  user: 'user',
  feed: 'feed',
  analytics: 'analytics',
} as const
