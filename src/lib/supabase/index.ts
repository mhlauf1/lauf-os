/**
 * Supabase client exports
 *
 * Usage:
 * - Client components: import { createClient } from '@/lib/supabase/client'
 * - Server components/API routes: import { createClient } from '@/lib/supabase/server'
 * - Cron jobs (bypass RLS): import { createAdminClient } from '@/lib/supabase/admin'
 */

export { createClient } from './client'
export { createClient as createServerClient } from './server'
export { createAdminClient } from './admin'
export { updateSession } from './middleware'
