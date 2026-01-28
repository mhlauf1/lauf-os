import { z } from 'zod'

export const createCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(50).optional(),
  sortOrder: z.number().int().optional(),
})

export const updateCollectionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  sortOrder: z.number().int().optional(),
})

export const addCollectionItemSchema = z.object({
  libraryItemId: z.string().uuid(),
  sortOrder: z.number().int().optional(),
})

export const removeCollectionItemSchema = z.object({
  libraryItemId: z.string().uuid(),
})

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>
export type AddCollectionItemInput = z.infer<typeof addCollectionItemSchema>
export type RemoveCollectionItemInput = z.infer<typeof removeCollectionItemSchema>
