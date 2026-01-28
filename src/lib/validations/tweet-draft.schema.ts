import { z } from 'zod'

export const createTweetDraftSchema = z.object({
  content: z.string().min(1).max(280),
  tweetNumber: z.number().int().min(1).optional(),
  totalTweets: z.number().int().min(1).optional(),
  status: z.enum(['DRAFT', 'READY', 'POSTED', 'ARCHIVED']).optional(),
  tags: z.array(z.string()).optional(),
})

export const updateTweetDraftSchema = z.object({
  content: z.string().min(1).max(280).optional(),
  tweetNumber: z.number().int().min(1).optional(),
  totalTweets: z.number().int().min(1).optional(),
  status: z.enum(['DRAFT', 'READY', 'POSTED', 'ARCHIVED']).optional(),
  tags: z.array(z.string()).optional(),
  postedAt: z.string().datetime().optional().nullable(),
})

export type CreateTweetDraftInput = z.infer<typeof createTweetDraftSchema>
export type UpdateTweetDraftInput = z.infer<typeof updateTweetDraftSchema>
