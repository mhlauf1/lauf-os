import type { LibraryItemType } from '@prisma/client'

export interface LibraryTypeConfig {
  id: LibraryItemType
  label: string
  pluralLabel: string
  color: string
  bgColor: string
  textColor: string
  icon: string
  description: string
}

export const libraryTypeConfig: Record<LibraryItemType, LibraryTypeConfig> = {
  INSPIRATION: {
    id: 'INSPIRATION',
    label: 'Inspiration',
    pluralLabel: 'Inspirations',
    color: '#f59e0b',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    icon: 'Sparkles',
    description: 'Sites, designs, and references that inspire you',
  },
  TEMPLATE: {
    id: 'TEMPLATE',
    label: 'Template',
    pluralLabel: 'Templates',
    color: '#8b5cf6',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-400',
    icon: 'LayoutTemplate',
    description: 'Reusable project templates and boilerplates',
  },
  AI_IMAGE: {
    id: 'AI_IMAGE',
    label: 'AI Image',
    pluralLabel: 'AI Images',
    color: '#ec4899',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    icon: 'Wand2',
    description: 'AI-generated images with prompts',
  },
  COMPONENT: {
    id: 'COMPONENT',
    label: 'Component',
    pluralLabel: 'Components',
    color: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    icon: 'Component',
    description: 'UI components and code snippets',
  },
  IDEA: {
    id: 'IDEA',
    label: 'Idea',
    pluralLabel: 'Ideas',
    color: '#22c55e',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    icon: 'Lightbulb',
    description: 'Creative ideas and concepts to explore',
  },
}

export const libraryTypeList = Object.values(libraryTypeConfig)

export function getLibraryTypeConfig(type: LibraryItemType): LibraryTypeConfig {
  return libraryTypeConfig[type]
}
