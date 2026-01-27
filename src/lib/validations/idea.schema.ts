import { z } from 'zod'

/**
 * Valid pillar types for content ideas
 */
export const pillarSchema = z.enum(['redesign', 'build', 'workflow', 'insight'])

/**
 * Valid status types for content ideas
 */
export const statusSchema = z.enum([
  'idea',
  'in_progress',
  'ready',
  'scheduled',
  'posted',
])

/**
 * Schema for creating a new idea
 */
export const createIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long'),
  body: z.string().max(10000, 'Body is too long').optional(),
  pillar: pillarSchema,
  status: statusSchema.optional().default('idea'),
  media_urls: z.array(z.string().url()).optional(),
  scheduled_for: z.string().datetime().optional(),
})

/**
 * Schema for updating an existing idea
 */
export const updateIdeaSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(500, 'Title is too long')
    .optional(),
  body: z.string().max(10000, 'Body is too long').optional().nullable(),
  pillar: pillarSchema.optional(),
  status: statusSchema.optional(),
  media_urls: z.array(z.string().url()).optional(),
  scheduled_for: z.string().datetime().optional().nullable(),
  sort_order: z.number().int().optional(),
})

/**
 * Schema for filtering ideas
 */
export const ideaFiltersSchema = z.object({
  pillar: pillarSchema.optional(),
  status: statusSchema.optional(),
  search: z.string().optional(),
})

// Type exports inferred from schemas
export type CreateIdeaInput = z.infer<typeof createIdeaSchema>
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>
export type IdeaFilters = z.infer<typeof ideaFiltersSchema>
