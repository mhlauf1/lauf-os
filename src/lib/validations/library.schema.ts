import { z } from 'zod'

export const createLibraryItemSchema = z.object({
  type: z.enum(['INSPIRATION', 'TEMPLATE', 'AI_IMAGE', 'COMPONENT', 'IDEA']),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  figmaUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  prompt: z.string().max(10000).optional(),
  aiTool: z.string().max(100).optional(),
  techStack: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isShowcased: z.boolean().optional(),
  isForSale: z.boolean().optional(),
  price: z.number().min(0).optional(),
})

export const updateLibraryItemSchema = z.object({
  type: z.enum(['INSPIRATION', 'TEMPLATE', 'AI_IMAGE', 'COMPONENT', 'IDEA']).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional().nullable(),
  sourceUrl: z.string().url().optional().nullable().or(z.literal('')),
  figmaUrl: z.string().url().optional().nullable().or(z.literal('')),
  githubUrl: z.string().url().optional().nullable().or(z.literal('')),
  prompt: z.string().max(10000).optional().nullable(),
  aiTool: z.string().max(100).optional().nullable(),
  techStack: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isShowcased: z.boolean().optional(),
  isForSale: z.boolean().optional(),
  price: z.number().min(0).optional().nullable(),
})

export type CreateLibraryItemInput = z.infer<typeof createLibraryItemSchema>
export type UpdateLibraryItemInput = z.infer<typeof updateLibraryItemSchema>
