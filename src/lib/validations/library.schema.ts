import { z } from 'zod'

// Library item types (simplified)
const libraryItemTypes = ['DESIGN', 'DEVELOPED'] as const

// Library item statuses (simplified)
const libraryItemStatuses = ['ACTIVE', 'ARCHIVED'] as const

// Code language options
const codeLanguages = [
  'tsx',
  'jsx',
  'typescript',
  'javascript',
  'css',
  'scss',
  'html',
  'json',
  'markdown',
  'python',
  'other',
] as const

export const createLibraryItemSchema = z.object({
  type: z.enum(libraryItemTypes),
  status: z.enum(libraryItemStatuses).optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  figmaUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  techStack: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  // Code fields
  code: z.string().max(100000).optional(), // 100KB max
  language: z.enum(codeLanguages).optional(),
  // Image field
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  goalId: z.string().uuid().optional(),
})

export const updateLibraryItemSchema = z.object({
  type: z.enum(libraryItemTypes).optional(),
  status: z.enum(libraryItemStatuses).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional().nullable(),
  sourceUrl: z.string().url().optional().nullable().or(z.literal('')),
  figmaUrl: z.string().url().optional().nullable().or(z.literal('')),
  githubUrl: z.string().url().optional().nullable().or(z.literal('')),
  techStack: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  // Code fields
  code: z.string().max(100000).optional().nullable(),
  language: z.enum(codeLanguages).optional().nullable(),
  // Image field
  thumbnailUrl: z.string().url().optional().nullable().or(z.literal('')),
  goalId: z.string().uuid().optional().nullable(),
})

export type CreateLibraryItemInput = z.infer<typeof createLibraryItemSchema>
export type UpdateLibraryItemInput = z.infer<typeof updateLibraryItemSchema>

// Export enums for use in other files
export const LIBRARY_ITEM_TYPES = libraryItemTypes
export const LIBRARY_ITEM_STATUSES = libraryItemStatuses
export const CODE_LANGUAGES = codeLanguages
