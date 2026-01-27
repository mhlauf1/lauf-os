export const siteConfig = {
  name: 'LAUF OS',
  description: 'Personal command center for building in public',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Default post times (24-hour format)
  defaultPostTimes: {
    morning: '09:00',
    afternoon: '14:00',
    evening: '19:00',
  },

  // Character limits
  limits: {
    postMaxChars: 280,
    ideaTitleMaxChars: 500,
    ideaBodyMaxChars: 10000,
  },

  // Content statuses
  statuses: ['idea', 'in_progress', 'ready', 'scheduled', 'posted'] as const,

  // Links
  links: {
    x: 'https://x.com/your_handle',
    github: 'https://github.com/your_username',
  },
} as const

export type Status = (typeof siteConfig.statuses)[number]
