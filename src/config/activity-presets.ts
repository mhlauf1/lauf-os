import type { TaskCategory, EnergyLevel } from '@prisma/client'

export interface ActivityPreset {
  slug: string
  title: string
  category: TaskCategory
  defaultDuration: number
  energyLevel: EnergyLevel
  sortOrder: number
}

export const ACTIVITY_PRESETS: ActivityPreset[] = [
  { slug: 'morning-routine', title: 'Morning Routine', category: 'ROUTINE', defaultDuration: 60, energyLevel: 'LIGHT', sortOrder: 1 },
  { slug: 'website-design', title: 'Website Design', category: 'DESIGN', defaultDuration: 90, energyLevel: 'DEEP_WORK', sortOrder: 2 },
  { slug: 'website-development', title: 'Website Development', category: 'CODE', defaultDuration: 90, energyLevel: 'DEEP_WORK', sortOrder: 3 },
  { slug: 'playbook-work', title: 'Playbook Work', category: 'SAAS', defaultDuration: 90, energyLevel: 'DEEP_WORK', sortOrder: 4 },
  { slug: 'meal-time', title: 'Meal Time', category: 'PERSONAL', defaultDuration: 30, energyLevel: 'LIGHT', sortOrder: 5 },
  { slug: 'break-time', title: 'Break Time', category: 'LEISURE', defaultDuration: 30, energyLevel: 'LIGHT', sortOrder: 6 },
  { slug: 'learning', title: 'Learning', category: 'LEARNING', defaultDuration: 90, energyLevel: 'MODERATE', sortOrder: 7 },
  { slug: 'fitness', title: 'Fitness', category: 'FITNESS', defaultDuration: 60, energyLevel: 'MODERATE', sortOrder: 8 },
  { slug: 'wellness', title: 'Wellness', category: 'PERSONAL', defaultDuration: 45, energyLevel: 'LIGHT', sortOrder: 9 },
  { slug: 'engineering', title: 'Engineering', category: 'CODE', defaultDuration: 90, energyLevel: 'DEEP_WORK', sortOrder: 10 },
  { slug: 'mobile-app-design', title: 'Mobile App Design', category: 'DESIGN', defaultDuration: 90, energyLevel: 'DEEP_WORK', sortOrder: 11 },
  { slug: 'mobile-app-development', title: 'Mobile App Development', category: 'CODE', defaultDuration: 90, energyLevel: 'DEEP_WORK', sortOrder: 12 },
  { slug: 'lauf-admin-work', title: 'Lauf Admin Work', category: 'ADMIN', defaultDuration: 90, energyLevel: 'MODERATE', sortOrder: 13 },
  { slug: 'lauf-client-work', title: 'Lauf Client Work', category: 'CLIENT', defaultDuration: 90, energyLevel: 'DEEP_WORK', sortOrder: 14 },
  { slug: 'read', title: 'Read', category: 'LEARNING', defaultDuration: 45, energyLevel: 'LIGHT', sortOrder: 15 },
  { slug: 'graphic-design', title: 'Graphic Design', category: 'DESIGN', defaultDuration: 90, energyLevel: 'DEEP_WORK', sortOrder: 16 },
  { slug: 'social-media-management', title: 'Social Media Management', category: 'NETWORKING', defaultDuration: 60, energyLevel: 'MODERATE', sortOrder: 17 },
  { slug: 'generic-work', title: 'Generic Work', category: 'ADMIN', defaultDuration: 90, energyLevel: 'MODERATE', sortOrder: 18 },
  { slug: 'night-routine', title: 'Night Routine', category: 'ROUTINE', defaultDuration: 60, energyLevel: 'LIGHT', sortOrder: 19 },
]

/** Set of lowercase preset titles for quick lookup */
export const PRESET_TITLES = new Set(
  ACTIVITY_PRESETS.map((p) => p.title.toLowerCase())
)
