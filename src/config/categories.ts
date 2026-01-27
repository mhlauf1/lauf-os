import type { TaskCategory } from '@prisma/client'

export interface CategoryConfig {
  id: TaskCategory
  label: string
  color: string
  bgColor: string
  textColor: string
  icon: string // Lucide icon name
}

export const categoryConfig: Record<TaskCategory, CategoryConfig> = {
  DESIGN: {
    id: 'DESIGN',
    label: 'Design',
    color: '#8b5cf6',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-400',
    icon: 'Palette',
  },
  CODE: {
    id: 'CODE',
    label: 'Code',
    color: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    icon: 'Code',
  },
  CLIENT: {
    id: 'CLIENT',
    label: 'Client',
    color: '#22c55e',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    icon: 'Users',
  },
  LEARNING: {
    id: 'LEARNING',
    label: 'Learning',
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    icon: 'BookOpen',
  },
  FITNESS: {
    id: 'FITNESS',
    label: 'Fitness',
    color: '#ef4444',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    icon: 'Dumbbell',
  },
  ADMIN: {
    id: 'ADMIN',
    label: 'Admin',
    color: '#6b7280',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-400',
    icon: 'FileText',
  },
  SAAS: {
    id: 'SAAS',
    label: 'SaaS',
    color: '#06b6d4',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    icon: 'Rocket',
  },
  NETWORKING: {
    id: 'NETWORKING',
    label: 'Networking',
    color: '#ec4899',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    icon: 'Network',
  },
  PERSONAL: {
    id: 'PERSONAL',
    label: 'Personal',
    color: '#a78bfa',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    icon: 'User',
  },
  LEISURE: {
    id: 'LEISURE',
    label: 'Leisure',
    color: '#34d399',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    icon: 'Coffee',
  },
  ROUTINE: {
    id: 'ROUTINE',
    label: 'Routine',
    color: '#fbbf24',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    icon: 'Sun',
  },
}

export const categoryList = Object.values(categoryConfig)

export function getCategoryConfig(category: TaskCategory): CategoryConfig {
  return categoryConfig[category]
}
