import { prisma } from '@/lib/prisma'

/**
 * Ensures a row exists in the `users` table for the given Supabase Auth user.
 * Called on write operations so the foreign key constraint is satisfied.
 */
export async function ensureUser(user: { id: string; email?: string }) {
  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email ?? '',
    },
  })
}
