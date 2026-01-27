/**
 * User profile as stored in the database
 */
export interface User {
  id: string
  email: string
  x_username: string | null
  x_access_token: string | null
  x_refresh_token: string | null
  created_at: string
}

/**
 * User profile without sensitive token data
 */
export interface SafeUser {
  id: string
  email: string
  x_username: string | null
  created_at: string
}

/**
 * Input for updating user settings
 */
export interface UpdateUserInput {
  x_username?: string
}
